//手机号
var telNum;

$(function () {
	console.log("预览界面");
	var user = JSON.parse(localStorage.user);
	$("#nameId").text(user.name);
	$("#positionId").text(user.position);
	$("#companyId").text(user.company.name);
	$("#company1").text(user.company.name);
	$("#personalId").text("个人宣言: " + user.personal);
	if (user.headImgUrl) {
		$("#man").css("backgroundImage", "url(" + user.headImgUrl + ")");
	}
	$("#companyDescId").text(user.company.companyDesc);
	if (user.company.companyWebsite) {
		$("#company1").text(user.company.name + ":");
	}
	$("#companyWebsiteId").text(user.company.companyWebsite);
	$("#companyAddId").text(user.company.companyAdd);
	if (user.email) {
		$("#email-text").text(user.email);
	}
	if (user.company.logo) {
		$("#logo").attr('src', user.company.logo);
	}
	telNum = user.tel;

	//根据姓名和职位，在之间加入分隔符·
	if (user.name && user.position) {
		$("#dot").text("·")
	}



	// 去除touch默认事件
	$("*").on('touchend', function (event) {
		event.preventDefault()
	})

	//弹出邮箱
	$("#my-email").on('touchend', function () {
		$("#emailDialog").show()
		$("#fade").show()
		return false
	})
	//关闭邮箱
	$("#emailDispear").on('touchend', function () {
		$("#emailDialog").hide()
		$("#fade").hide()
		return false
	})


	//弹出“在微信中使用”提示
	$(".useInWechat").on("touchend", function () {
		$("#useInWechatDialog").show();
		$("#fade").show();
		return false;
	})

	//关闭弹出“在微信中使用”提示
	$("#useInWechatDispear").on("touchend", function () {
		$("#useInWechatDialog").hide();
		$("#fade").hide();
		return false;
	})


})



//手机号验证
function smstel() {
	if (!checkphone(telNum)) {
		alert("手机号为空！");
		return false;
	}
	console.log("打电话了" + telNum);
	document.getElementById("callPhone").tap()
}

//验证手机号是否为空
function checkphone(phone) {
	if (phone == null || phone == "null" || phone == "" || typeof (phone) == "undefined") {
		return false;
	} else {
		return true;
	}
}