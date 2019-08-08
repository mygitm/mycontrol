var checkMeteCode=new Array();
$('#main-table').tree({
    url: 'tableTree',
    method: 'get',
    onSelect:function (node) {
        if(node.parentId==""||node.parentId==null){
            return ;
        }
        document.getElementById("managerTabledataClassId").value=node.id;
        $('#main-table2').datagrid('clearChecked');
        $('#main-table2').datagrid(
            {url: 'queryTableDetailList',
                queryParams: {
                    managerTabledataClassId: node.id
                }
            }
        );
},onLoadSuccess:function(node, data){// 加载成功后折叠所有节点
    $('#main-table').tree('collapseAll');
}
});


$('#main-table2').datagrid({
    remoteSort: false,
    iconCls: 'icon-set',
    width:1200,
    // url: '',
    striped: true,
    idField: 'id',
    pagination: true,
    pageSize: 50,
    fit: true,
   // fitColumns: true,
    rownumbers: true,
    method: 'get',
    ctrlSelect: true,
    toolbar: '#btubar2',
    columns: [[
        {field: 'select', checkbox: true},
        {field: 'id', hidden: true},
        {field: 'managerTabledataClassId', hidden: true},
        {field: 'fieldName', title: '字段名', width: 100},
        {field: 'metaName', title: '名称', width: 200},
        {field: 'metaCode', title: '标识符', width: 150},
        {field: 'symbolCode', title: '数据格式', width: 100},
        {field: 'dataformat', title: '表示格式', width: 100},
         {field: 'primaryKey', title: '是否主键', width: 100},
        {field: 'updateTime', title: '更新时间', width: 150},
        {field: 'required', title: '是否必填', width: 100},
        {field: 'foreignKey', title: '是否外键', width: 100,},
        {field: 'foreignTableName', title: '关联外键表', width: 120},
        {field: 'foreignColumnName', title: '关联外键列', width: 120},
        {field: 'selfDefinedRule', title: '自定义规则', width: 150}
        /*{field: 'pym', title: '拼音码', width: 100},
        {field: 'wbm', title: '五笔码', width: 100}*/

    ]]
});


$('#metaCode').combogrid({
    mode: 'remote',
    width:390,
    pagination: true,
    url: 'metadataDetail',
    //toolbar: '#searchboxTobar',
    idField: 'metacode',
    textField: 'metacode',
    columns: [[
        {field:'metacode',title:'标识符',width:200},
        {field:'metaname',title:'标识名称',width:150},
        {field:'dataformat',title:'表示格式',width:100}
    ]],keyHandler:{
        up: function() {},
        down: function() {},
        enter: function() {},
        query: function(value) {
            var _value=value.replace(/(^\s*)|(\s*$)/g, "");
            if (checkMeteCode[0]!==_value) {
                $('#metaCode').combogrid("grid").datagrid("reload", {'metacode': value});
                checkMeteCode[0] = _value;
                $('#metaCode').combogrid("setValue", value);
           }
        }
    }, onCheck: function (rowIndex, rowData){
                checkMeteCode[0]=rowData.metacode;
                checkMeteCode[1]=rowData.metacode;
               $("#dataformat").textbox('setValue', rowData.dataformat);
    }

});


$('#symbolCode').combobox({
    valueField: 'value',
    textField: 'label',
    data: [
        {label: '字符类型', value: 'VARCHAR2'},
        {label: '数值类型', value: 'NUMBER'},
        {label: '日期类型', value: 'DATE'},
        {label: '二进制类型', value: 'BLOB'}
    ]
});


function addTableData(){
    $('#table_form').form('reset');
    document.getElementById("addOrEidtUrl").value="addTabke";
    $('#tableType').combobox({
        url:'tableList',
        textField: 'typeName',
        valueField: 'id',
    });
    $("#table_dialog").dialog("open").dialog("setTitle", "新增数据库表");
}

function addTableDetailData(){

   var  managerTabledataClassId= document.getElementById("managerTabledataClassId").value;
    if (managerTabledataClassId ==""||managerTabledataClassId==null) {
        $.messager.alert("注意", "请选择数据库表！");
        return;
    }
    $('#table_form2').form('reset');
    $('#id').val("");
    document.getElementById("addOrEidtDetailUrl").value="addTableDetail?managerTabledataClassId="+$('#managerTabledataClassId').val();
    $("#table_dialog2").dialog("open").dialog("setTitle", "新增表字段");



}

function editTableDetailData(){
    var selectRows = $('#main-table2').datagrid("getSelections");
    if (selectRows.length ==0) {
        $.messager.alert("注意", "请选择一行数据！");
        return;
    }
    if (selectRows.length > 1) {
        $.messager.alert("注意", "只能编辑一行数据！");
        return;
    }
    $('#table_form2').form('reset');
    selectData = selectRows[0];
    document.getElementById("id").value=selectRows[0].id;
    $('#table_form2').form('load', selectData);
    document.getElementById("addOrEidtDetailUrl").value="updateTableDetail?id="+$('#id').val()+"&managerTabledataClassId="+$('#managerTabledataClassId').val();
    $("#table_dialog2").dialog("open").dialog("setTitle", "修改表字段");

}



function closeDialog() {
    $('#table_form').form('reset');
    $('#table_dialog').dialog('close');
}




//保存数据
function saveTable() {
    $('#table_form').form('submit', {
        url: $('#addOrEidtUrl').val(),
        onSubmit: function () {
            return $(this).form('validate');
        }, success: function (data) {
            var result = eval('(' + data + ')'); //将返回的json字符串转换为对象
            if (result.retCode == 1) {
                //重新加载更新后的行政区划
                $('#table_form').form('reset');
                $('#table_dialog').dialog('close');
                //消息提示
                $.messager.show({
                    title: '提示',
                    msg: '保存成功！',
                    timeout: 2000,
                    showType: 'slide'
                });
                $('#main-table').tree('reload');
            } else {
                $.messager.alert('结果', '保存失敗！', 'warning');
            }
        }
    });
}

function deleteTable(){
    var obj=$("#main-table").tree('getSelected');
    if (obj.id==null||obj.id=="") {
        $.messager.alert('注意', '请选择数据项！');
        return;
    }
    if(obj.parentId==""||obj.parentId==null){
        return;
    }
    $.messager.confirm('确认', '确定删除该记录？', function (choice) {
        if (choice) {
            $.ajax({
                type: "POST",
                url:'deleteTable',
                data:{id:obj.id},
                success: function (result) {
                    if(result.retCode===1) {
                        $.messager.alert('结果','删除成功！');
                        $('#main-table').tree('reload');
                    }else{
                        $.messager.alert('结果','删除失败！');
                    }
                }
            });
        }
    });


}

function editTable(){
    var obj= $("#main-table").tree('getSelected').dataObj;
     if(obj.parentId==null||obj.parentId==""){
         return;
     }
    if (obj.id==null||obj.id=="") {
        $.messager.alert('注意', '请选择数据项！');
        return;
    }
    document.getElementById("addOrEidtUrl").value="updateTable"
    $('#tableType').combobox({
        url:'tableList',
        textField: 'typeName',
        valueField: 'id',
    });
    $('#table_form').form('load', obj);
    $('#tableType').combobox('setValue',obj.parentId);
    document.getElementById("parentId").value=obj.id;
    $("#table_dialog").dialog("open").dialog("setTitle", "修改数据库表");
}

function closeDialog2() {
    $('#table_form2').form('reset');
    $('#table_dialog2').dialog('close');
}


function saveTableDetailData(){
    if(checkMeteCode[0]!=null&&checkMeteCode[0]!=checkMeteCode[1]){
        $.messager.alert('注意', '请选择规范的标识符！');
        return;
    }
    $('#table_form2').form('submit', {
        url: $('#addOrEidtDetailUrl').val(),
        onSubmit: function () {
            return $(this).form('validate');
        }, success: function (data) {
            var result = eval('(' + data + ')'); //将返回的json字符串转换为对象
                if (result.retCode == 1) {
                    //重新加载更新后的行政区划
                    $('#table_form2').form('reset');
                    $('#table_dialog2').dialog('close');
                    //消息提示
                    $.messager.show({
                        title: '提示',
                        msg: '保存成功！',
                        timeout: 2000,
                        showType: 'slide'
                    });
                    $('#main-table2').datagrid({
                        url: 'queryTableDetailList',
                        queryParams: {
                            managerTabledataClassId: $('#managerTabledataClassId').val(),
                        }
                    });
            } else {
                $.messager.alert('结果', '保存失敗！', 'warning');
            }
        }
    });


}





function deleteTableDetails(){
    var rows =$('#main-table2').datagrid('getSelections');
    var ids = [];

    for(var i=0; i<rows.length; i++){
        ids[i]=rows[i].id;
    }
  //  var _lastSelectClassId=
    if (ids.length === 0) {
        $.messager.alert('注意', '请选择数据项！');
        return;
    }
    $.messager.confirm('确认', '确定删除该记录？', function (choice) {
        if (choice) {
            $.ajax({
                type: "POST",
                url: "deleteTableDetails",
                data: JSON.stringify(ids),
                dataType:"json",
                contentType:"application/json",
                success: function (result) {
                    if(result.retCode===1) {
                        $.messager.alert('结果','删除成功！');
                        $('#main-table2').datagrid({
                            url: 'queryTableDetailList',
                            queryParams: {
                                managerTabledataClassId: rows[0].managerTabledataClassId
                            }
                        });
                    }else{
                        $.messager.alert('结果','删除失败！'+result.retMsg);
                    }
                }
            });
        }
    });
}


function queryTableNames(){
    var tableName=  document.getElementById("type_name").value;
    $('#main-table').tree({
        url: 'queryTableNames', //即使是异步树，使用查询框时也应该查同步树
        method: 'get',
        queryParams: {
            typeName: tableName
        }
    });
}

function sendTableData(){
    var obj=$("#main-table").tree('getSelected');
    if (obj.id==null||obj.id=="") {
        $.messager.alert('注意', '请选择数据项！');
        return;
    }
    if(obj.parentId==""||obj.parentId==null){
        $.messager.alert('注意', '请选择数据库表！');
        return ;
    }
    $.messager.confirm('确认', '确定要发送消息吗？', function (trueFalse) {
        if (trueFalse) {
            $.ajax({
                type: "POST",
                url: "sendTableDetail",
                data: { id: obj.id,typeCode:obj.dataObj.typeCode},
                success: function (result) {
                    if(result.retCode===1) {
                        $.messager.alert('结果',result.retMsg);
                    }else{
                        $.messager.alert('结果','发送失败！');
                    }
                }
            });
        }
    });

}

