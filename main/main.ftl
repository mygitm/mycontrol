<!DOCTYPE html>
<html lang="zh-cn" xmlns="http://www.w3.org/1999/html">
<head>
    <title>管控中心系统</title>
<#include "../common/top.ftl">
</head>

<body>
<div style="margin:20px 0;"></div>
<body class="easyui-layout" style="overflow-y: hidden;" scroll="no">
<div class="mainNorth" data-options="region:'north'">

    <div class="lay1" style="text-align: left; ">
        <img class="mainAppImg" src="${(pmsSysAppBean.icon)!'images/company_logo.png'}">
        <span class="mainAppName" href="javascript:;">${(pmsSysAppBean.appName)!}</span>
    </div>

    <div id="lay2" class="lay2" style="overflow-y:auto;">
        <ul>
                <#if pmsSysResourceBeanList?exists>
                <#list pmsSysResourceBeanList as p>
                    <li>
                        <a id="${p.resourceId?c}" href="javascript:void(0);" onclick="loadResource(${p.resourceId?c})">
                            <div class="mainMenuImgDiv"><img class="mainMenuImg" src="${(p.icon)!'images/sysManager.png'}"></div>
                            <div class="mainMenu">${(p.name)!}</div>
                        </a>
                    </li>
                </#list>
                </#if>
        </ul>
    </div>

    <div class="lay3" style="float: right; padding-right: 1px;">
        <div>
            <div class="easyui-panel" data-options="border:0" style="background: none;">
                <a class="easyui-menubutton" style="height: 100%" data-options="menu:'#setting',iconCls:'icon-man'">${(pmsSysEmployeeBean.name)!}</a>
            </div>
            <div id="setting" style="width:60px;">
                <div data-options="iconCls:'icon-more'" onclick="modifyUserInfo()">个人信息</div>
                <div data-options="iconCls:'icon-edit-pwd'" onclick="modifyPassword()">修改密码</div>
                <div data-options="iconCls:'icon-clear'" onclick="logout()">注销</div>
                <div data-options="iconCls:'icon-tip'" onclick="showVersion('${version!}')">关于</div>
            </div>
        </div>
    </div>

<#--<div class="lay3" style="float: right; text-align: center;vertical-align: middle;">
    <img src="/images/head.png">
</div>-->

</div>
<div class="ddd">

</div>
<div class="mainWest" data-options="region:'west',split:true" title=" " border="false">
    <div class="easyui-accordion" id="menu_accordion" data-options="fit:true,border:false">
    </div>
</div>
<div region="center" style="overflow: hidden;">
    <div id="tabs" class="easyui-tabs" data-options="fit:true,border:false,plain:true">
        <div title="首页" data-options="iconCls:'icon-main'" style="padding: 10px;">
            <img src="images/welcome.png" style="position: relative;top: 25%;left: 50%;width: 50%">
        </div>
    </div>
</div>
</div>

<div id="mm" class="easyui-menu" style="width: 150px;">
    <div id="mm-tabupdate">刷新</div>
    <div class="menu-sep"></div>
    <div id="mm-tabclose">关闭</div>
    <div id="mm-tabcloseall">全部关闭</div>
    <div id="mm-tabcloseother">关闭其他</div>
</div>
<!-- 底部信息 -->
<#--<div region="south" style="height: 30px; line-height: 25px; text-align: center;  font-family: microsoft yahei;">
    Copyright ©2018 和宇健康科技股份有限公司 版本号: ${version}
</div>-->

<div style="display:none">
    <div id="dlg" style="width:480px;height:620px;padding-left: 70px;" class="easyui-dialog" data-options="closed:true,title:'个人信息',novalidate:true,modal:true,buttons:'#dlg-buttons',onClose:function(){$('#userInfo-form').form('reset')}">
        <form id="userInfo-form" class="easyui-form" method="post" data-options="validate:true">
            <table class="tableBorder">
                <tr>
                    <th style="text-align: right"><sup style="color: red">*</sup>姓名:</th>
                    <td><input class="easyui-textbox" name="name"
                               data-options="required:true,validType:'length[0,120]'"/></td>

                </tr>
                <tr>
                    <th style="text-align: right"><sup style="color: red">*</sup>员工编码:</th>
                    <td><input id="code" class="easyui-textbox" name="code"
                               data-options="required:true,validType:['unique','length[0,50]']"/></td>
                </tr>
                <tr>
                <#-- 异步拿数据 -->
                    <th style="text-align: right"><sup style="color: red">*</sup>组织:</th>
                    <td><input id="orgTreeForm" name="orgId" class="easyui-combobox" data-options="required:true"></td>
                </tr>

                <tr>
                    <th style="text-align: right">性别:</th>
                    <td>
                        <select name="sex" class="easyui-combobox" data-options="panelHeight:'auto',panelMaxHeight:180">
                            <option value="1">男</option>
                            <option value="0">女</option>
                        </select>
                    </td>

                </tr>

                <tr>
                    <th style="text-align: right">出生日期:</th>
                    <td><input class="easyui-datebox" name="birthday"
                    ></td>
                </tr>

                <tr>
                    <th style="text-align: right">邮箱:</th>
                    <td><input class="easyui-textbox" name="email" data-options="validType:'email'"
                    ></td>
                </tr>

                <tr>
                    <th style="text-align: right">电话:</th>
                    <td><input class="easyui-textbox" name="phone" data-options="validType:'Phone'"
                    ></td>
                </tr>
                <tr>
                    <th style="text-align: right">身份证号码:</th>
                    <td><input class="easyui-textbox" name="idnum" data-options="validType:'IdCard'"
                    ></td>
                </tr>
                <tr>
                    <th style="text-align: right">五笔码:</th>
                    <td><input class="easyui-textbox" name="wbcode" data-options="validType:'length[0,64]'"
                    ></td>
                </tr>
                <tr>
                    <th style="text-align: right">拼音码:</th>
                    <td><input class="easyui-textbox" name="pycode" data-options="validType:'length[0,64]'"
                    ></td>
                </tr>
                <tr>
                    <th style="text-align: right">备注:</th>
                    <td><input class="easyui-textbox" name="memo" style="height:60px;width: 190px"
                               data-options="multiline:true,validType:'length[0,50]'"></td>
                </tr>
                <input type="hidden" class="easyui-textbox" name="employeeId">
            </table>
        </form>
    </div>
    <div id="dlg-buttons">
        <a href="#" class="easyui-linkbutton saveBt" iconCls="icon-save" onclick="saveUserInfo()">保存</a>
        <a href="#" class="easyui-linkbutton" iconCls="icon-cancel" onclick="javascript:$('#dlg').dialog('close')">取消</a>
    </div>
</div>

<div style="display:none">
    <div id="pwd" style="width:480px;height:250px;padding-left: 70px;" class="easyui-dialog" data-options="closed:true,title:'修改密码',novalidate:true,modal:true,buttons:'#pwd-buttons',onClose:function(){$('#pwd-form').form('reset')}">
        <form id="pwd-form" class="easyui-form" method="post" data-options="validate:true">
            <table class="tableBorder">
                <tr>
                    <th style="text-align: right"><sup style="color: red">*</sup>旧密码：</th>
                    <td><input class="easyui-textbox" name="oldPassword" type="password"
                               data-options="required:true,validType:{length:[6,15]}"/></td>
                </tr>
                <tr>
                    <th style="text-align: right"><sup style="color: red">*</sup>新密码：</th>
                    <td><input class="easyui-textbox" id="newPassword" name="newPassword" type="password"
                               data-options="required:true,validType:['isPassword','length[6,15]']"/></td>
                </tr>
                <tr>
                    <th style="text-align: right"><sup style="color: red">*</sup>确认新密码：</th>
                    <td><input class="easyui-textbox" type="password"
                               data-options="required:true" validType="equals['#newPassword']"/></td>
                </tr>
            </table>
        </form>
    </div>
    <div id="pwd-buttons">
        <a href="#" class="easyui-linkbutton saveBt" iconCls="icon-save" onclick="savePwd()">保存</a>
        <a href="#" class="easyui-linkbutton" iconCls="icon-cancel" onclick="javascript:$('#pwd').dialog('close')">取消</a>
    </div>
</div>

<script src="${base}/js/main.js"></script>
</body>
</html>