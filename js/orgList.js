// 查询
function searchOrg() {
    var name = $('#name').textbox('getValue');
    var code = $('#code').textbox('getValue');
    var firsttime = $('#firsttime').datebox('getValue');
    var lasttime = $('#lasttime').datebox('getValue');
    var registpermission = $('#registpermission').combobox('getValue');
    var qrcodepermission = $('#qrcodepermission').combobox('getValue');
    var joinstatus = $('#joinstatus').combobox('getValue');
    $('#dg').datagrid('load', {
        orgName : name,
        orgCode : code,
        firstTime : firsttime,
        lastTime : lasttime,
        registPermission : registpermission,
        qrcodePermission : qrcodepermission,
        joinStatus : joinstatus
    })
}

// 重置
function resetOrg() {
    $('#name').textbox('clear');
    $('#code').textbox('clear');
    $('#firsttime').datebox('clear');
    $('#lasttime').datebox('clear');
    $('#registpermission').combobox('clear');
    $('#qrcodepermission').combobox('clear');
    $('#joinstatus').combobox('clear');
}

// 导入
function importOrg() {
    $('#import_dialog').dialog('open');
}

function putOrg() {
    $('#import_form').form('submit', {
        url: 'import',
        success : function(data) {
            data = eval('(' + data + ')');// easyui提交返回的json字符串需要转换
            importMessage(data);
        }
    });
}

// 获取窗口宽度
function fixWidth(percent){
    return document.documentElement.clientWidth * percent; //这里你可以自己做调整
}

// 窗口关闭清空表单
$('#dialog').dialog({
    onClose : function () {
        $('#form').form('clear');
        $('#contactUnit').combotree('tree').tree("collapseAll");
        $('#registPermission').combobox('setValue', 1);
        $('#qrcodePermission').combobox('setValue', 1);
        $('#joinStatus').combobox('setValue', 1);
    }
});

// 关闭表单
function closeDialog() {
    $('#dialog').dialog('close');
}

function save() {
    $('#form').form('submit',{
        onSubmit : function() {
            var flag = $(this).form('validate');
            if ($(this).form('validate')) {
                var row = $('#dg').datagrid('getSelections');
                if (row.length == 1) {
                    if ($('#orgId').val()) {
                        var oRegistPermission = row[0].registPermission;
                        var oQrcodePermission = row[0].qrcodePermission;
                        var oJoinStatus = row[0].joinStatus;
                        var nRegistPermission = $('#registPermission').combobox('getValue');
                        var nQrcodePermission = $('#qrcodePermission').combobox('getValue');
                        var nJoinStatus = $('#joinStatus').combobox('getValue');
                        if (oRegistPermission != nRegistPermission || oQrcodePermission != nQrcodePermission || oJoinStatus != nJoinStatus) {
                            $.messager.confirm('状态-变更', '授权状态或接入状态已变更，是否确认保存？', function(r) {
                                if (r) {
                                    $.ajax({
                                        type : 'post',
                                        dataType : 'json',
                                        url : 'update',
                                        data : $('#form').serialize(),
                                        success : function (data) {
                                            messages(data);
                                        }
                                    });
                                }
                            });
                            return false;
                        }
                    }
                }
            }
            return flag;
        },
        success : function(data) {
            data = eval('(' + data + ')');// easyui提交返回的json字符串需要转换
            messages(data);
        }
    });
}

function modify() {
    var flag;
    var row = $('#dg').datagrid('getSelections');
    if (row.length != 1) {
        $.messager.alert('提示', '请选择一条记录', 'warning');
        return;
    }
    $('#form').form('reset');
    $('#contactUnit').combotree('tree').tree("collapseAll");
    $('#form').form({url : 'update'});
    $('#form').form('load','selectOrgById?orgId='+row[0].orgId);
    $('#dialog').dialog('open').dialog('setTitle','机构详情');
}

// 新增
function addOrg() {
    $('#form').form('reset');
    $('#contactUnit').combotree('tree').tree("collapseAll");
    $('#registPermission').combobox('setValue',1);
    $('#qrcodePermission').combobox('setValue',1);
    $('#joinStatus').combobox('setValue',1);
    $('#form').form({url : 'add'});
    $('#dialog').dialog('open').dialog('setTitle','新建机构');
}

// 机构导入信息提示
function importMessage(data) {
    if (data.retCode == 1) {
        $('#import_dialog').dialog('close');
        $('#dg').datagrid('reload');
        //消息提示
        $.messager.show({
            title : '提示',
            msg : data.retMsg,
            timeout : 2000,
            showType : 'slide'
        });
    } else {
        $.messager.alert({
            title : '错误',
            msg : data.retMsg
        });
    }
}

// 解析结果并提示
function messages(data) {
    if (data.retCode == 1) {
        //关闭表单dialog
        $('#dialog').dialog('close');
        $('#dg').datagrid('reload');
        //消息提示
        $.messager.show({
            title : '提示',
            msg : data.retMsg,
            timeout : 2000,
            showType : 'slide'
        });
    } else {
        $.messager.show({
            title : '错误提示',
            msg : data.retMsg,
            timeout : 5000,
            showType : 'slide'
        });
    }
}

// 统一社会信用代码校验
function CheckSocialCreditCode(Code) {
    var patrn = /^[0-9A-Z]+$/;
    //18位校验及大写校验
    if ((Code.length != 18) || (patrn.test(Code) == false)) {
        // console.info("不是有效的统一社会信用编码！");
        return false;
    }
    else {
        var Ancode;//统一社会信用代码的每一个值
        var Ancodevalue;//统一社会信用代码每一个值的权重
        var total = 0;
        var weightedfactors = [1, 3, 9, 27, 19, 26, 16, 17, 20, 29, 25, 13, 8, 24, 10, 30, 28];//加权因子
        var str = '0123456789ABCDEFGHJKLMNPQRTUWXY';
        //不用I、O、S、V、Z
        for (var i = 0; i < Code.length - 1; i++) {
            Ancode = Code.substring(i, i + 1);
            Ancodevalue = str.indexOf(Ancode);
            total = total + Ancodevalue * weightedfactors[i];
            //权重与加权因子相乘之和
        }
        var logiccheckcode = 31 - total % 31;
        if (logiccheckcode == 31) {
            logiccheckcode = 0;
        }
        var Str = "0,1,2,3,4,5,6,7,8,9,A,B,C,D,E,F,G,H,J,K,L,M,N,P,Q,R,T,U,W,X,Y";
        var Array_Str = Str.split(',');
        logiccheckcode = Array_Str[logiccheckcode];

        var checkcode = Code.substring(17, 18);
        if (logiccheckcode != checkcode) {
            // console.info("不是有效的统一社会信用编码！");
            return false;
        }
        return true;
    }
}

// 编码唯一校验
$.extend($.fn.validatebox.defaults.rules, {
    CheckSocialCreditCode : {
        validator : function (value, param) {
            var flag = CheckSocialCreditCode(value);
            return flag;
        },
        message: '不是有效的统一社会信用编码'
    },
    checkCode : {
        validator : function (value, param) {
            var flag = true;
            var orgId = $('#orgId').val();
            $.ajax({
                type: 'get',
                async: false,
                data: {
                    orgId: orgId,
                    orgCode: value
                },
                url : 'checkCode',
                success : function (result) {
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
                        title: '错误提示',
                        msg: '网络错误',
                        timeout: 5000,
                        showType: 'slide'
                    });
                }
            });
            return flag;
        },
        message: '机构编码已存在'
    },
    checkName : {
        validator : function (value, param) {
            var flag = true;
            var orgId = $('#orgId').val();
            $.ajax({
                type: 'get',
                async: false,
                data: {
                    orgId: orgId,
                    orgName: value
                },
                url : 'checkName',
                success : function (result) {
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
                        title: '错误提示',
                        msg: '网络错误',
                        timeout: 5000,
                        showType: 'slide'
                    });
                }
            });
            return flag;
        },
        message: '机构名称已存在'
    }
});