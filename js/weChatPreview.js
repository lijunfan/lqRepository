//手机号
var telNum;
//用户信息
var user = new Object();
//员工编号
var userCode;
//微信二维码Url
var weChatQrCode;

$(function () {
	window.addEventListener("orientationchange", function () {
		setTimeout(function () {
			location = location
		}, 200);
	}, false);
	console.log("预览界面");
	//获取员工编号
	var LocString = String(window.document.location.href);

	function getQueryStr(str) {
		var rs = new RegExp("(^|)" + str + "=([^&]*)(&|$)", "gi").exec(LocString),
			tmp;
		if (tmp = rs) {
			return tmp[2];
		}
		// parameter cannot be found 
		return "";
	}
	userCode = getQueryStr("code");

	//发送ajax请求。根据员工编号获取用户信息
	$.ajax({
		url: 'http://117.36.75.166:8881/api/userController/getUserByUserCode',
		type: 'GET', //GET
		data: {
			userCode: userCode
		},
		async: false,
		dataType: 'json', //返回的数据格式：json/xml/html/script/jsonp/text
		success: function (result) {
			if (result.returnValue == 'SUCCESS') {
				var res = result.object;
				if (res.status == 1) {
					user = res.user[0];
					telNum = user.tel;
					$("#title").text(user.name + "的名片");
					$("#nameId").text(user.name);
					$("#positionId").text(user.position);
					$("#companyId").text(user.company.name);
					$("#company1").text(user.company.name);
					$("#personalId").text("个人宣言: " + user.personal);
					if (user.headImgUrl) {
						$("#man").css("backgroundImage", "url(" + user.headImgUrl + ")");
					}
					$("#companyDescId").text('  ' + user.company.companyDesc);
					if (user.weChatQrCode) {
						$("#weChat-text img").attr('src', user.weChatQrCode);
					}
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

					//根据姓名和职位，在之间加入分隔符·
					if (user.name && user.position) {
						$("#dot").text("·")
					}

					//拨打电话href赋值
					$("#callPhone").attr('href', function () {
						return 'tel:' + telNum
					});
				}

			}

		},
		error: function (err) {
			alert(err.reason);
		}
	})

	// 去除touch默认事件
	$("*").on('touchend', function (event) {
		event.preventDefault()
	})

	//拨打电话
	$('#call-phone').on('touchend', function () {
		smstel();
	});

	//加我微信
	$('#add-weixin').on('touchend', function () {
		$("#weChatDialog").show()
		$("#fade").show()
		return false
	})
	$("#weChatDispear").on('touchend', function () {
		$("#weChatDialog").hide()
		$("#fade").hide()
		return false
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
	//收藏名片遮罩
	$("#collect-card").on('touchend', function () {
		$("#fade").fadeIn(700);
		$("#card_collect").fadeIn(700);
	})
	$("#card_collect").on('touchend', function () {
		$("#fade").fadeOut(700);
		$("#card_collect").fadeOut(700);

	})

	//关闭打电话空号提示
	$("#telDispear").on('touchend', function () {
		$("#telDialog").hide()
		$("#fade").hide()
		return false
	})

})



//手机号验证
function smstel() {
	if (!checkphone(telNum)) {
		$("#tel-text").text("暂无电话号码");
		$("#telDialog").show();
		$("#fade").show();
		return false;
	}
	document.getElementById("callPhone").click()
}

//验证手机号是否为空
function checkphone(phone) {
	if (phone == null || phone == "null" || phone == "" || typeof (phone) == "undefined") {
		return false;
	} else {
		return true;
	}
}