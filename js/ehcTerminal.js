function formatDataTime(value,row) {
    var date = new Date(value);
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    var d = date.getDate();
    return y + '-' +m + '-' + d;
}

function formatLicenseStatus(val,row){
    if(val==0){
        return '未授权';
    }else{
        return '已授权';
    }
}


function formatJoinStatus(val,row){
    if(val==0){
        return '禁用';
    }else{
        return '启用';
    }
}
$('#dg').datagrid({
    rowStyler:function(index,row){
        if (row.joinStatus==0){
            return 'color:gray;';
        }
    }
});
// 获取窗口宽度
function fixWidth(percent){
    return document.documentElement.clientWidth * percent; //这里你可以自己做调整
}

$("#Rt_dialog").dialog({
    onClose: function () {
        $('#Rt_form').form('reset');
    }
});

function save(){

    var title = $("#Rt_dialog").panel('options').title;
    var terminalId =  $("#terminalId").textbox('getValue');
    var licenseStatus = $("#licenseStatus").combobox("getValue");
    var joinStatus = $("#joinStatus").combobox("getValue");
    if(title == '终端列表编辑') {
        $.ajax({
            type: 'get',
            async: false,
            data: {
                terminalId: terminalId,
                licenseStatus: licenseStatus,
                joinStatus:joinStatus
            },
            url: 'status',
            success: function (Result) {
                if (Result.retCode == 1) {
                    $('#Rt_form').form('submit',{
                        onSubmit : function() {
                            return $(this).form('validate');
                        },
                        url: 'update',
                        success : function(data) {
                            data = eval('(' + data + ')');// easyui提交返回的json字符串需要转换
                            result(data);
                        }
                    })
                } else if (Result.retCode == 0 ) {
                    $.messager.confirm('确认', '授权状态或接入状态已变更，是否确认保存', function (r) {
                        if (r) {
                            $('#Rt_form').form('submit',{
                                onSubmit : function() {
                                    return $(this).form('validate');
                                },
                                url: 'update',
                                success : function(data) {
                                    data = eval('(' + data + ')');// easyui提交返回的json字符串需要转换
                                    result(data);
                                }
                            })
                        }
                    });
                }
            }
        });
    }else{
        $('#Rt_form').form('submit',{
            onSubmit : function() {
                return $(this).form('validate');
            },
            success : function(data) {
                data = eval('(' + data + ')');// easyui提交返回的json字符串需要转换
                result(data);
            }
        })
    }

}

// 关闭dialog
function closedialog(){
    $('#Rt_form').form('reset');
    $('#Rt_dialog').dialog({closed:true});
}

// 添加
function modify(ae){
    if(ae == 'add'){
        $("#Rt_dialog").dialog("open").dialog("setTitle","终端列表新增");
        $('#model').textbox('textbox').attr('disabled', false);
        $('#Rt_form').form({url : 'add'});
    }else if(ae == 'edit'){
        var rows = $('#dg').datagrid('getSelections');
        if (rows.length != 1) {
            $.messager.alert('提示', '请选择一条记录', 'warning');
            return;
        }
        var row=rows[0];
        $("#Rt_dialog").dialog("open").dialog("setTitle","终端列表编辑");
        /*$('#model').textbox('textbox').attr('disabled', true);*/
        $('#Rt_form').form('load','selectEhcTerminal?terminalId='+row.terminalId);
        $('#Rt_form').form({url : 'update'});
        /* $('#licenseStatus').combobox({
             onChange : function (newLicenseStatus, oldLicenseStatus) {
                 console.info(newLicenseStatus+'新1');
                 console.info(oldLicenseStatus+'旧1');


                 $.messager.confirm('确认', '授权状态或接入状态已变更，是否确认保存', function (r) {
                     if (r) {
                     }
                 }

             }
         });
         $('#joinStatus').combobox({
             onChange : function (newJoinStatus, oldJoinStatus) {
                 console.info(newJoinStatus+'新11');
                 console.info(oldJoinStatus+'旧11');
             }
         });*/
    }
}




// 解析结果并提示
function result(data) {
    if (data.retCode == 1) {
        //关闭表单dialog
        $('#Rt_dialog').dialog('close');
        $('#dg').datagrid('reload');
        //消息提示
        $.messager.show({
            title : '提示',
            msg : data.retMsg,
            timeout : 2000,
            showType : 'slide'
        });
    } else {
        //关闭表单dialog
        $('#Rt_dialog').dialog('close');
        /* $.messager.show({
             title : '错误提示',
             msg : data.retMsg,
             timeout : 5000,
             showType : 'slide'
         });*/
        $.messager.alert('提示', data.retMsg, 'warning');
    }
}



// 编码唯一校验
$.extend($.fn.validatebox.defaults.rules,{
    checkModel : {
        validator : function (value,param) {
            var flag = true;
            var title = $("#Rt_dialog").panel('options').title;
            // 新增校验
            if (title == '终端列表新增') {
                var model = $('#model').textbox('getValue');
                $.ajax({
                    type:'get',
                    async:false,
                    data : {
                        model : model
                    },
                    url:'ehcTerminalModel',
                    success: function (result) {
                        if (result.retCode == 1) {
                            flag = true;
                        } else if (result.retCode == 0 && result.retMsg == "Exception") {
                            flag = true;
                        } else {
                            flag = false;
                        }
                    },
                    error : function () {
                        $.messager.show({
                            title : '错误提示',
                            msg : '网络错误',
                            timeout : 5000,
                            showType : 'slide'
                        });
                    }
                });
            }else if(title == '终端列表编辑'){
                var model = $('#model').textbox('getValue');
                var terminalId =  $("#terminalId").textbox('getValue');
                var licenseStatus = $("#licenseStatus").combobox("getValue");
                var joinStatus = $("#joinStatus").combobox("getValue");
                $.ajax({
                    type:'get',
                    async:false,
                    data : {
                        terminalId:terminalId,
                        model : model
                    },
                    url:'ehcTerminalModels',
                    success: function (result) {
                        if (result.retCode == 1) {
                            flag = true;
                        } else if (result.retCode == 0 && result.retMsg == "Exception") {
                            flag = true;
                        } else {
                            flag = false;
                        }
                    },
                    error : function () {
                        $.messager.show({
                            title : '错误提示',
                            msg : '网络错误',
                            timeout : 5000,
                            showType : 'slide'
                        });
                    }
                });
            }
            return flag;
        },
        message:'终端型号已存在'
    }
});

// 编码唯一校验
$.extend($.fn.validatebox.defaults.rules,{
    checkCode : {
        validator : function (value,param) {
            var flag = true;
            var title = $("#Rt_dialog").panel('options').title;
            // 新增校验
            if (title == '终端列表新增') {
                var terminalCode = $('#terminalCode').textbox('getValue');
                $.ajax({
                    type:'get',
                    async:false,
                    data : {
                        terminalCode : terminalCode
                    },
                    url:'ehcTerminalCode',
                    success: function (result) {
                        if (result.retCode == 1) {
                            flag = true;
                        } else if (result.retCode == 0 && result.retMsg == "Exception") {
                            flag = true;
                        } else {
                            flag = false;
                        }
                    },
                    error : function () {
                        $.messager.show({
                            title : '错误提示',
                            msg : '网络错误',
                            timeout : 5000,
                            showType : 'slide'
                        });
                    }
                });
            }else if(title == '终端列表编辑'){
                var terminalCode = $('#terminalCode').textbox('getValue');
                var terminalId =  $("#terminalId").textbox('getValue');
                $.ajax({
                    type:'get',
                    async:false,
                    data : {
                        terminalId:terminalId,
                        terminalCode : terminalCode
                    },
                    url:'ehcTerminalCodes',
                    success: function (result) {
                        if (result.retCode == 1) {
                            flag = true;
                        } else if (result.retCode == 0 && result.retMsg == "Exception") {
                            flag = true;
                        } else {
                            flag = false;
                        }
                    },
                    error : function () {
                        $.messager.show({
                            title : '错误提示',
                            msg : '网络错误',
                            timeout : 5000,
                            showType : 'slide'
                        });
                    }
                });
            }
            return flag;
        },
        message:'终端编码已存在'
    }
});
