var $table;          //父页面table表格id
var $topIndex;      //openDialog的dialog index

function Init(index, paramMap) {
    var handlerType = paramMap.get("handlerType");
    $("#handlerType").val(handlerType);

    switch(handlerType)
    {
        case "add":
            break;
        case "addChild":
            $("#parentID").val(paramMap.get("parentID"));
            $("#parentName").val(paramMap.get("parentName"));
            break;
        case "edit":
            //查询
            $.getJSON("get?id=" + paramMap.get("id"),function(data) {
                if (data.success) {
                    //如果有父级就查询父级的ID和Name
                    if (data.data.parentID != 0) {
                        $.getJSON("get?id=" + data.data.parentID,function(result){
                            if (result.success) {
                                $("#parentName").val(result.data.name);
                            }
                        });
                    }
                    $("#id").val(data.data.categoryID);
                    $("#parentID").val(data.data.parentID);
                    $("#name").val(data.data.name);
                    $("#sort").val(data.data.sort);
                    $("#showFlag").bootstrapSwitch('state', data.data.showFlag);
                    $("#icon").val(data.data.icon);
                    $("#icon_key").addClass(data.data.icon);    //给图标添加样式
                    $("#icon_value").html(data.data.icon);
                }
            });
            break;
        default:
            break;
    }
}

function doSubmit(index, paramMap) {
    $topIndex = index;
    $table = paramMap.get("table");
    $('#inputForm').submit();
}

//验证初始化
$('#inputForm').validator({
    focusCleanup:true,
    stopOnError:false,
    //debug: true,
    timely: 2,
    fields: {
        "name": {
            rule: "required;",
            tip: "",
            ok: "",
            msg:{
                required: "分类名称不能为空!",
            }
        },
        "sort": {
            rule: "required;float",
            tip: "",
            ok: "",
            msg: {
                required: "排序不能为空!"
            }
        }
    },
    rules:{
        float:function(element, params) {
            return /^^\d+\.\d\d$/.test(element.value) || "范例 如:3.12"
        }
    },
    //验证成功
    valid: function(form) {
        var target = this;
        target.holdSubmit();        //ajax提交表单之前, 先禁用submit
        $.post("save",$("form").serialize(),function(data){
            data = JSON.parse(data);
            if (data.success) {
/*                $table.bootstrapTable('refreshOptions',{pageNumber:1});*/
                $table.bootstrapTable('refresh',{silent: true});
                top.layer.msg(data.message, {icon: 1,time:1400});
            } else {
                top.layer.msg(data.message, {icon: 2,time:1400});
            }
            target.holdSubmit(false);   //可以再次提交
            top.layer.close($topIndex);
        });
    },
    invalid: function(form) {}//验证失败
});

function openSelectMenuDialog() {
    var paramMap = new Map();
    paramMap.put("iframeIndex", 1);
    paramMap.put("id", $("#id").val());
    paramMap.put("parentID", $("#parentID").val());
    paramMap.put("type", "MENU");                    //请求类型: ALL全部(包括按钮), MENU(菜单)
    wd.openDialog('选择上级分类','330px','760px','productCategory/select-productCategory',paramMap);
}

$(function () {

    /*----------------------------------------------------------------------------------------------------------------*/

    //清除上级菜单
    $("#DelButton").click(function(){
        $("#parentID").val("");
        $("#parentName").val("");
    });

    //打开选择上级菜单
    $("#Button").click(function(){
        openSelectMenuDialog();
    });

    //打开选择上级菜单
    $("#parentName").click(function(){
        openSelectMenuDialog();
    });

    /*----------------------------------------------------------------------------------------------------------------*/

    //打开图标选择窗口
    $("#btn_select").click(function(){
        var paramMap = new Map();
        paramMap.put("iframeIndex", 1);
        wd.openDialog('选择分类图标','900px','720px','common/select-icons', paramMap);
    });

    //清除图标
    $("#btn_reset").click(function(){
        $("#icon").val("");
        $("#icon_key").removeClass();
        $("#icon_value").html("");
    });

    /*----------------------------------------------------------------------------------------------------------------*/

    //是否显示
    $("#showFlag").bootstrapSwitch({
        onText:"显示",
        offText:"隐藏",
        onColor:"success",
        offColor:"danger",
        size:"small"
    });

    //资源类型
    $("input[name='type']").iCheck({
        radioClass: 'iradio_square-blue'
    });
});
