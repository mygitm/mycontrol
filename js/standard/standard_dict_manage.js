//简单的防全局污染


$('#managerMetasetType').combobox({
    valueField: 'typeCode',
    textField: 'typeName',
    url:'managerBaseDateTypeList',
    onLoadSuccess:function(){
        var val = $(this).combobox('getData');
        for (var item in val[1]){
            if (item == 'typeCode'){
                $(this).combobox('select', val[1][item]);
            }
        }
        $('#main-table').datagrid(
            {
                url: 'listData',
                queryParams: {
                    managerMetasetTypeId: $('#managerMetasetType').combobox('getValue'),basedataCode: ''
                }
            }
        );
    }
});

    $('#managerMetasetTypeId').combobox({
        valueField: 'typeCode',
        textField: 'typeName',
        url:'managerBaseDateTypeList'
    });




var sdm = {
    // scene:criteria标准、project项目子表 type:新增或修改
    setParam: function (scene) {
        if (scene === 'criteria') {
                sdm.datagrid = $('#main-table');
                sdm.dialog = $('#dia');
                sdm.dialog_width = 400;
                sdm.form = $('#ff');
                sdm.form_url = 'save';
                sdm.del_url = 'delete';
                sdm.datagrid_parm = {
                    url: 'listData',
                    queryParams: {
                        managerMetasetTypeId: $('#managerMetasetType').combobox('getValue')
                    }
                };
        } else if (scene === 'project') {
            sdm.datagrid = $('#main-table2');
            sdm.dialog = $('#dia2');
            sdm.dialog_width = 350;
            sdm.form = $('#ff2');
            sdm.form_url = 'project/save';
            sdm.del_url = 'project/delete';
            sdm.datagrid_parm = {
                url: 'project/listData',
                queryParams: {
                    managerBasedataDescribeId: sdm.lastSelectBaseId
                }
            };
            // 项目子表多传一个参数
            sdm.form_ext_parm = function (parm) {
                parm.managerBasedataDescribeId = sdm.lastSelectBaseId;
            };
        } else {
            $.messager.alert("注意", "未定义场景");
        }
    },
    datagrid: undefined,
    dialog: undefined,
    dialog_width: undefined,
    form: undefined,
    form_url: undefined,
    form_ext_parm: undefined,
    datagrid_parm: undefined,
    del_url: undefined,
    managerMetasetTypeId: undefined,// 数据集类型
    modify: function (scene, type) {
            sdm.setParam(scene);
            var title;
            if (type === 'add') {
                title = '新增';
                sdm.form.form('load', {id: null, managerBasedataDescribeId: sdm.lastSelectBaseId,managerMetasetTypeId:$('#managerMetasetType').combobox('getValue')});
            } else if (type === 'edit') {
                var selectRows = sdm.datagrid.datagrid("getSelections");
                if (selectRows.length <=0) {
                    $.messager.alert("注意", "请先选择一行数据进行编辑！");
                    return;
                }
            if (selectRows.length > 1) {
                $.messager.alert("注意", "只能编辑一行数据！");
                return;
            }
            title = '编辑';
            //直接加载数据，因为字段能对应，不用特别处理json对象
            sdm.form.form('load', selectRows[0]);
           // alert(document.getElementById("managerMetasetTypeId").value+"------"+selectRows[0].managerMetasetTypeId);
        }
        if (!sdm.lastSelectBaseId) {
            $.messager.alert('Warning', '请先选择一条标准', 'Warning');
            return;
        }
        if (scene === 'criteria') {
            $('#appCodeCombobox').combobox({
                valueField: 'value',
                textField: 'label',
                data: [
                    {label: '请选择代码', value: ''},
                    {label: '管控中心', value: 'pc'},
                ],
            });
        }
        sdm.dialog.dialog({
            title: title,
            width: sdm.dialog_width,
            closed: false,
            cache: false,
            modal: true,
            onBeforeOpen: function () {
                sdm.form_init();
            },
            onBeforeClose:function () {
                sdm.form.form('clear')
            }
        });
    },
    form_init: function () {
        sdm.form.form({
            url: sdm.form_url,
            onSubmit: function () {
                //验证form内所有easyui-validatebox ,返回true才会发起请求
                var isValid = $(this).form('validate');
                /*if (isValid) {
                    //传额外参数，parm相当于controlor第一个实体参数的对象，也可以在form中加入隐藏的input实现
                     if (Object.keys(parm).length !== 0) {
                         sdm.form_ext_parm(parm);
                     }
                }*/
                return isValid;
            },
            success: function (data) {
                var msg, flag;
                msg = '操作失败！';
                try {
                    var dataObj = JSON.parse(data);
                    if (dataObj.retCode === 1) {
                        flag = true;
                        //成功时关闭窗口，否则不关闭
                        sdm.dialog.dialog('close');
                    } else if (!dataObj.retMsg) {
                        msg = '操作失败:' + data.retMsg;
                    }
                } catch (e) {
                    console.error(e)
                }

                if (flag) {
                    sdm.datagrid.datagrid('clearSelections');
                    sdm.datagrid.datagrid(sdm.datagrid_parm);
                    $.messager.show({
                        title: '提示',
                        msg: '操作成功。'
                    });
                } else {
                    $.messager.alert('警告', msg, 'error')
                }

            }
        });
    },
    lastSelectBaseId: undefined,//最后一次选择标准的id，在标准列表中多选时，最后一次勾选。子表显示对应此条记录的子记录
    del: function (scene) {
        sdm.setParam(scene);
        var rows = sdm.datagrid.datagrid('getSelections');
        var ids = [];
        for(var i=0; i<rows.length; i++){
            ids[i]=rows[i].id;
        }
        if (ids.length === 0) {
            $.messager.alert('注意', '请选择数据项！');
            return;
        }
        $.messager.confirm('确认', '确定删除该记录？', function (choice) {
            if (choice) {
                $.ajax({
                    type: "POST",
                    url: sdm.del_url,
                    data: JSON.stringify(ids),
                    dataType:"json",
                    contentType:"application/json",
                    success: function (result) {
                        if(result.retCode===1) {
                            $.messager.alert('结果','删除成功！');
                            sdm.datagrid.datagrid(sdm.datagrid_parm);
                        }else{
                            $.messager.alert('结果','删除失败！'+result.retMsg);
                        }
                    }
                });
            }
        });
    },
};


$('#main-table').datagrid({
    remoteSort: false,
    iconCls: 'icon-set',
   // url: 'listData', //这里为空时可以实现只加载一次，但是第一次加载时分页没用，只能选择下拉框加载一次后才正常。直接不加url参数就正常了
    striped: true,
    idField: 'id',
    pagination: true,
    pageSize: 50,
    fit: true,
    showPageList: false,
    showRefresh: false,
    displayMsg: '',
    fitColumns: true,
    rownumbers: true,
    method: 'get',
    ctrlSelect: true,
    toolbar: '#btubar',
    rowStyler: function (index, row) {
        if (row.enable === 0) {
            return 'color:gray;';
        }
    },
    columns: [[
        {field: 'select', checkbox: true},
        {field: 'id', hidden: true},
        {field: 'managerMetasetTypeId', hidden: true},
        {field: 'basedataCode', title: '标准代码', width: 100},
        {field: 'basedataName', title: '标准代码名称', width: 200}

       // {field: 'describe', title: '修改描述', width: 100, align: 'right'}
    ]],// queryParams: {managerMetasetTypeId: $('#managerMetasetType').combobox('getValue')},
    onSelect:function (index, row) {
        sdm.lastSelectBaseId=row.id;
        $('#main-table2').datagrid(
            {
                url: 'project/listData',
                queryParams: {
                    managerBasedataDescribeId: row.id
                }
            }
        );
    },onLoadSuccess:function (){
        $(this).datagrid('clearSelections');
        $(this).datagrid('selectRow',0);
    }
    ,onBeforeLoad:function () {
        var pager = $('#main-table').datagrid('getPager');
        pager.pagination({showPageList: false, showRefresh: true, displayMsg: ''});

    }
});


$('#main-table2').datagrid({
    remoteSort: false,
    iconCls: 'icon-set',
    // url: '',
    striped: true,
    idField: 'id',
    pagination: true,
    pageSize: 50,
    fit: true,
    fitColumns: true,
    rownumbers: true,
    method: 'get',
    ctrlSelect: true,
    toolbar: '#btubar2',
    rowStyler: function (index, row) {
        if (row.enable === 0) {
            return 'color:gray;';
        }
    },
    columns: [[
        {field: 'select', checkbox: true},
        {field: 'id', hidden: true},
        {field: 'itemCode', title: '项目代码', width: 100},
        {field: 'itemName', title: '项目名称', width: 100},
        {field: 'timeCodeDesc', title: '项目描述', width: 100}
    ]],onLoadSuccess:function (){
        $(this).datagrid('clearSelections');
    }
});



function queryBaseDateNames(){
    var managerMetasetType=$('#managerMetasetType').combobox('getValue');
    var basedataCodeValue=  document.getElementById("basedataCodeValue").value;
    $('#main-table2').datagrid('loadData',{total:0,rows:[]});
    $('#main-table').datagrid(
        {
            url: 'listData',
            queryParams: {
                managerMetasetTypeId: managerMetasetType,basedataCode: basedataCodeValue
            }
        }
    );
}

function queryItemValue(){
    var itemCodeValue=document.getElementById("itemCodeValue").value;
    var itemNameValue=  document.getElementById("itemNameValue").value;
    if(sdm.lastSelectBaseId==null||sdm.lastSelectBaseId==""){
        return;
    }
    $('#main-table2').datagrid(
        {
            url: 'project/listData',
            queryParams: {
                managerBasedataDescribeId:  sdm.lastSelectBaseId,itemCode:itemCodeValue,itemName:itemNameValue
            }
        }
    );
}



/*$('#itemName').textbox({
    onChange: function(value) {
        var simply = pinyin.getCamelChars(value);
        $('#itemPym').textbox('setText', simply);

    }
});*/


/*function converPinyin(){
    var itemCodeValue=document.getElementById("itemName").value;


}*/




