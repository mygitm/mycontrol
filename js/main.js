$("body").on("click","li",function() {
    $(this).find("a").addClass("nav-active").parents("li").siblings().find("a").removeClass("nav-active");
});
/*$(document).ready(
    function () {
        //机构树
        $.ajax({
            type:'get',
            url:'sys/employee/orgTree',
            success:function (result) {
                if(result.retCode == 1){
                    $('#orgTreeCombo').combotree({data:result.data});
                    $('#orgTreeForm').combotree({data:result.data});
                } else {
                    $.messager.alert('错误',result.retMsg);
                }

            },error:function () {
                $.messager.alert('错误','网络错误！');
            }
        });

    }
);*/
function loadResource(id) {
    $.get('sys/resource/selectMenus?parentId='+id,function(data){
        $.each(data,function(i,n){
            var isSelected = i == 0 ? true : false;
            $(".panel-title").html("<img style='width: 14px;height: 14px;float: left;margin-top: 9px;margin-right: 5px;' src='images/menu.png'></img>  "+n.text);
            $('#menu_accordion').accordion({
                onAdd:function () {
                    var p = $('#menu_accordion').accordion('getSelected');
                    if(p){
                        var indexTemp = $('#menu_accordion').accordion('getPanelIndex', p);
                        $('#menu_accordion').accordion('remove',indexTemp);
                    }
                }
            });
            $('#menu_accordion').accordion('add',{
                // title:n.text,
                selected: isSelected,
                iconCls: n.icon,
                content:'<ul id="tree_' + n.id + '"></ul>'
            });
            $('#tree_'+n.id).tree({
                data:n.children,
                onLoadSuccess:function(node,data){
                    var nodes = $('#tree_'+n.id).tree('getChildren');
                    $.each(nodes,function(i,val){
                        var nodetarget = nodes[i].target;
                        if(data[i].icon==null){
                            $(nodetarget).children(".tree-icon").css("background","url(images/defaultSystemSet.png) no-repeat center center").css("background-size","14px 14px");
                        }else {
                            $(nodetarget).children(".tree-icon").css("background","url("+data[i].icon+") no-repeat center center").css("background-size","14px 14px");
                        }

                    });
                    $('#tree_'+n.id).tree('expandAll');
                },
                onClick:function(node){
                    if (node.url && $.trim(node.url)!='') {
                        var url = node.url;
                        if(url.indexOf("/")==0){
                            url = url.substring(1);
                        }
                        addTab(node.text, url, node.icon);
                    }
                }
            });
        });
    });
}
function addTab(title, url, iconCls) {
    if ($('#tabs').tabs('exists', title)) {
        $('#tabs').tabs('select', title);
        var currTab = $('#tabs').tabs('getSelected');
        var url = $(currTab.panel('options').content).attr('src');
        if (url) {
            $('#tabs').tabs('update', {
                tab : currTab,
                options : {
                    content : createFrame(url)
                }
            });
        }
    } else {
        $('#tabs').tabs('add', {
            title : title,
            content : createFrame(url),
            closable : true,
            iconCls : iconCls
        });
    }
}
function createFrame(url) {
    return '<iframe id="mainIframe" scrolling="no" frameborder="0"  src="' + url
        + '"></iframe>';
}
$(function() {
    tabClose();
    tabCloseEven();
});
function tabClose() {
    /*双击关闭TAB选项卡*/
    $(document).on("dblclick", ".tabs-inner", function() {
        var subtitle = $(this).children(".tabs-closable").text();
        $('#tabs').tabs('close', subtitle);
    })
    /*为选项卡绑定右键*/
    $(document).on('contextmenu', '.tabs-inner', function(e) {
        $('#mm').menu('show', {
            left : e.pageX,
            top : e.pageY
        });

        var subtitle = $(this).children(".tabs-closable").text();

        $('#mm').data("currtab", subtitle);
        $('#tabs').tabs('select', subtitle);
        return false;
    });
}
//绑定右键菜单事件
function tabCloseEven() {
    //刷新
    $(document).on('click', '#mm-tabupdate', function() {
        var currTab = $('#tabs').tabs('getSelected');
        var url = $(currTab.panel('options').content).attr('src');
        if (url) {
            $('#tabs').tabs('update', {
                tab : currTab,
                options : {
                    content : createFrame(url)
                }
            });
        }
    });
    //关闭当前
    $(document).on('click', '#mm-tabclose', function() {
        var currtab_title = $('#mm').data("currtab");
        $('#tabs').tabs('close', currtab_title);
    })
    //全部关闭
    $(document).on('click', '#mm-tabcloseall', function() {
        $('.tabs-inner span').each(function(i, n) {
            var t = $(n).text();
            if(t != '首页') {
                $('#tabs').tabs('close', t);
            }
        });
    });
    //关闭除当前之外的TAB
    $(document).on('click', '#mm-tabcloseother', function() {
        $('.tabs-selected').siblings().each(function(i,n){
            var t=$('a:eq(0) span',$(n)).text();
            if(t != '首页') {
                $('#tabs').tabs('close', t);
            }
        });
    });
}
// 版本信息
function showVersion(versionInfo) {
    $.messager.show({
        title : '提示',
        msg : '和宇健康科技股份有限公司'+'</br></br>'+'版本号:'+ versionInfo,
        timeout : 5000,
        showType : 'slide'
    });
}
/*修改个人信息*/
function modifyUserInfo() {
    var data = $('#userInfo-form');
    $("#dlg").dialog("setTitle","个人信息");
    $.ajax({
        url:'sys/employee/selectUserInfo',
        type:'get',
        success: function (result) {
            if(result.retCode == 1){
                data.form('load',result.data);
                $('#orgTreeForm').combotree('setValue',{id:result.data.orgId});
                var node = $('#orgTreeForm').combotree('tree').tree('getSelected');
                $('#orgTreeForm').combotree('tree').tree('expandTo',node.target);
            } else {
                $.messager.show({
                    title : '错误',
                    msg : result.retMsg,
                    timeout : 5000,
                    showType : 'slide'
                });
            }

        },
        error:function (xhr,msg,err) {
            $.messager.show({
                title : '错误',
                msg : '网络错误！',
                timeout : 5000,
                showType : 'slide'
            });
        }
    });

    data.form({url: 'sys/employee/edit'});
    $('#code').textbox('textbox').attr('disabled',true);
    $('#dlg').dialog('open');
}
/*保存个人信息*/
function saveUserInfo() {
    var data = $('#userInfo-form');
    data.form('submit', {
            onSubmit: function () {
                //提交前校验
                var valida = $(this).form('enableValidation').form('validate');
                return valida;
            },
            success: function (result) {
                var resultobj = eval('('+ result +')');
                if(resultobj.retCode==1) {
                    $.messager.show({
                        title : '提示',
                        msg : '修改成功,重新登录后生效！',
                        timeout : 3000,
                        showType : 'slide'
                    });
                }else{
                    $.messager.show({
                        title : '提示',
                        msg : '修改失败:'+resultobj.retMsg,
                        timeout : 5000,
                        showType : 'slide'
                    });
                }
                $('#dlg').dialog('close');
                data.form('disableValidation');
            }
        }
    )
}
// 修改密码
function modifyPassword() {
    var data = $('#pwd-form');
    $("#pwd").dialog("setTitle","修改密码");
    data.form({url: 'sys/user/savePassword'});
    $('#pwd').dialog('open');
}

/*保存密码*/
function savePwd() {
    var data = $('#pwd-form');
    data.form('submit', {
            onSubmit: function () {
                //提交前校验
                var valida = $(this).form('enableValidation').form('validate');
                return valida;
            },
            success: function (result) {
                var resultobj = eval('('+ result +')');
                if(resultobj.retCode==1) {
                    $.messager.show({
                        title : '提示',
                        msg : '修改成功',
                        timeout : 3000,
                        showType : 'slide'
                    });
                }else{
                    $.messager.show({
                        title : '提示',
                        msg : '修改失败:'+resultobj.retMsg,
                        timeout : 5000,
                        showType : 'slide'
                    });
                }
                $('#pwd').dialog('close');
                data.form('disableValidation');
            }
        }
    )
}

function logout(){
    $.messager.confirm('提示', '确定注销吗', function(ok) {
        if (!ok) {
            return;
        }
        location.href='logout'
    });
}
// 检查密码和重新输入密码是相同的
$.extend($.fn.validatebox.defaults.rules, {
    isPassword:{
        validator:function (value,param) {
            var unique = true;
            var reg = /^[a-zA-Z0-9]*$/;
            if (!reg.test(value)) {
                unique = false;
            }
            return unique;
        },
        message:"密码只能是英文和数字！"
    },
    equals: {
        validator: function(value,param){
            return value == $(param[0]).val();
        },
        message: '密码不一致'
    }
});

