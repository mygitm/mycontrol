var checkMeteCode=new Array();

//简单的防全局污染
var metam = {
    // scene:criteria标准、detail项目子表 type:新增或修改
    setParam: function (scene) {
        metam.isType = scene === 'type';
        if (metam.isType) {
            metam.tree = $('#main-tree');
            metam.dialog = $('#dia');
            metam.form = $('#ff');
            metam.form_url = 'type/save';
            metam.del_url = 'type/delete';
        } else if (scene === 'detail') {
            metam.datagrid = $('#main-table2');
            metam.dialog = $('#dia2');
            metam.form = $('#ff2');
            metam.form_url = 'detail/save';
            metam.del_url = 'detail/delete';
            metam.datagrid_parm = {
                url: 'detail/listData',
                queryParams: {
                    managerMetadataClassId: metam.lastSelectClassId
                }
            };
            // 项目子表多传一个参数
            metam.form_ext_parm = function (parm) {
                parm.managerMetadataClassId = metam.lastSelectClassId;
            };
        } else {
            $.messager.alert("注意", "未定义场景");
        }
    },
    isType: undefined,//是否为元数据类型相关操作
    tree: undefined,
    datagrid: undefined,
    dialog: undefined,
    form: undefined,
    form_url: undefined,
    form_ext_parm: undefined,
    datagrid_parm: undefined,
    del_url: undefined,
    managerMetasetTypeId: undefined,// 数据集类型
    modifyClasses: function ( type) {
        metam.setParam('type');
        $('#parentid').combobox({
            url:'MetadataClassParentList',
            textField: 'typename',
            valueField: 'id'
        });
        var title;
        if (type === 'add') {
            title = '新增';
            metam.form.form('load', {id: null});
        } else if (type === 'edit') {
            var selectedNode = metam.tree.tree("getSelected");
            if (selectedNode === null) {
                $.messager.alert('注意', '请先选择一条元数据类型', '提示');
                return;
            }
            title = '编辑';

            //直接加载数据，因为字段能对应，不用特别处理json对象
            metam.form.form('load', selectedNode.dataObj);
        }
        metam.open_dialog(title);
    },
    modifyDetail: function (type) {
        metam.setParam('detail');
        var title;
        if (type === 'add') {
            title = '新增';
          //  metam.form.form('reset');
           // $('#parentid').combobox("clear");
            metam.form.form('load', {id: null, managerMetadataClassId: metam.lastSelectClassId});
        } else if (type === 'edit') {
            var selectData;
            var selectRows = metam.datagrid.datagrid("getSelections");
            if (selectRows.length !== 1) {
                $.messager.alert("注意", "请选择一条元数据定义！");
                return;
            }
            selectData = selectRows[0];
            title = '编辑';
            //直接加载数据，因为字段能对应，不用特别处理json对象
            metam.form.form('load', selectData);
           // $('#standardcode').combogrid("setValue", selectData.standardcode);
        }

        if (!metam.lastSelectClassId) {
            $.messager.alert('注意', '请先选择一条元数据类型', 'Warning');
            return;
        }
        $('#prec').numberspinner({
            min: 0,
            max: 10,
            editable: false
        });
        $('#maxrange').numberspinner({
            min: 0,
            max: 100,
            editable: true
        });
        $('#minrange').numberspinner({
            min: 0,
            max: 100,
            editable: true
        });


        metam.open_dialog(title);
    },
    open_dialog: function (title) {
        metam.dialog.dialog({
            title: title,
            // width: sdm.dialog_width,
            // height: 200,
            closed: false,
            cache: false,
            modal: true,
           /* buttons: [{
                text: '保存',
                handler: function () {
                    metam.form.submit();
                }
            }, {
                text: '取消',
                handler: function () {
                    metam.dialog.dialog('close')
                }
            }],*/
            onBeforeOpen: function () {

                metam.form_init();
            },
            onBeforeClose:function () {
                metam.form.form('clear')
            }
        });
    },
    form_init: function () {


        metam.form.form({
            url: metam.form_url,
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
                        metam.dialog.dialog('close');
                    } else if (!dataObj.retMsg) {
                        msg = '操作失败:' + data.retMsg;
                    }
                } catch (e) {

                }

                if (flag) {
                    // sdm.datagrid.datagrid(sdm.datagrid_parm);
                    if (metam.isType) {
                        metam.tree.tree('reload');
                    } else {
                        metam.datagrid.datagrid('reload');
                    }
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
    lastSelectClassId: undefined,//最后一次选择元数据定义的id，在标准列表中多选时，最后一次勾选。子表显示对应此条记录的子记录
    del: function (scene) {
        metam.setParam(scene);
        var ids = [];
        if (metam.isType) {
            ids[0] = metam.tree.tree("getSelected").dataObj.id;
        } else {
            var rows = metam.datagrid.datagrid("getSelections");
            for(var i=0; i<rows.length; i++){
                ids[i]=rows[i].id;
            }
        }

        if (ids.length === 0) {
            $.messager.alert('注意', '请选择数据项！');
            return;
        }
        $.messager.confirm('确认', '确定删除该记录？', function (choice) {
            if (choice) {
                $.ajax({
                    type: "POST",
                    url: metam.del_url,
                    data: JSON.stringify(ids),
                    dataType:"json",
                    contentType:"application/json",
                    success: function (result) {
                        if(result.retCode===1) {
                            $.messager.alert('结果','删除成功！');
                            if(scene=="type") {
                                metam.tree.tree('reload');
                            }else {
                                metam.datagrid.datagrid(metam.datagrid_parm);
                            }
                        }else{
                            $.messager.alert('结果','删除失败！'+result.retMsg);
                        }
                    }
                });
            }
        });
    },
};
$('#main-tree').tree({
    url: 'type/listData',
    // url: 'type/listData/sync', #这种为同步树，一次查出所有节点
    toolbar: '#btubar',
    method: 'get',
    onClick: function (node) {
        metam.lastSelectClassId=node.id;

        // 不清除已选项时，选择过多个tree节点后，每个节点对应的已选择的项会一直为勾选状态，成为了意料之外的多选效果
        $('#main-table2').datagrid('clearChecked');

        $('#main-table2').datagrid(
            {
                url: 'detail/listData',
                queryParams: {
                    managerMetadataClassId: metam.lastSelectClassId
                }
            }
        );
    },
});


function searchMetaDataClass(){
    $('#main-table2').datagrid('clearChecked');
    $('#main-table2').datagrid(
        {
            url: 'detail/listData',
            queryParams: {
                managerMetadataClassId: metam.lastSelectClassId,metacode:$("#metaCodeValue").textbox('getValue')
            }
        }
    );
}

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
        {field: 'metacode', title: '标识符', width: 100},
        {field: 'metaname', title: '标识符名称', width: 100},
        {field: 'metadefine', title: '标识符定义', width: 100},
        {field: 'symbolcode', title: '数据格式', width: 100},
        {field: 'dataformat', title: '表示格式', width: 100},
        {field: 'minrange', title: '最小', width: 100},
        {field: 'maxrange', title: '最大', width: 100},
        {field: 'prec', title: '小数位', width: 100},
        {field: 'unitmeasurement', title: '计量单位', width: 100},
        {field: 'datasource', title: '数据来源说明', width: 100},
        {field: 'standardcode', title: '标准编码', width: 100},
    ]]
});

$.extend($.fn.validatebox.defaults.rules, {
    number: {
        validator: function(value, param){
            /*
            * 小数4位以内，大于零的小数或整数
            * */
            var numberReg = /^[1-9]\d*$|^([1-9]\d*|0)\.\d+$/;
            return numberReg.test(value);
        },
        message: 'Please enter at least {0} characters.'
    }
});





function searchMetadata(){
    var metadataName=  document.getElementById("metadataName").value;
    var typeTree = $('#main-tree');
    typeTree.tree({
        url: 'type/listDataNameLike/sync', //即使是异步树，使用查询框时也应该查同步树
        method: 'get',
        queryParams: {
            typename: metadataName
        },
        onLoadSuccess: function (node, data) {// 加载成功后展开所有节点
            typeTree.tree('getRoots').forEach(function (node) {
              //  typeTree.tree('expandAll', node.target)
            });
        }
    });
}

$('#standardcode').combogrid({
    mode: 'remote',
    width:385,
    pagination: true,
    url: 'listBaseData',
    idField: 'basedataCode',
    textField: 'basedataCode',
    columns: [[
        {field:'basedataCode',title:'标准代码',width:200},
        {field:'basedataName',title:'标准代码名称',width:200}
    ]],keyHandler:{
        up: function() {},
        down: function() {},
        enter: function() {},
        query: function(value) {
            var _value=value.replace(/(^\s*)|(\s*$)/g, "");
            if (checkMeteCode[0]!==_value) {
                $('#standardcode').combogrid("grid").datagrid("reload", {'basedataCode': value});
                checkMeteCode[0] = value;
                $('#standardcode').combogrid("setValue", value);
            }
        }
    }, onCheck: function (rowIndex, rowData){
        checkMeteCode[0]=rowData.basedataCode;
        checkMeteCode[1]=rowData.basedataCode;
        //$("#dataformat").textbox('setValue', rowData.dataformat);
    }

});

$('#symbolcode').combobox({
    valueField: 'value',
    textField: 'label',
    data: [
        {label: '字符型-不可枚举型', value: 'S1'},
        {label: '字符型-枚举型', value: 'S2'},
        {label: '字符型-代码表型', value: 'S3'},
        {label: '布尔', value: 'L'},
        {label: '数值型', value: 'N'},
        {label: '日期型', value: 'D'},
        {label: '日期时间型', value: 'DT'},
        {label: '时间型', value: 'T'},
        {label: '二进制', value: 'BY'},
    ],
});


