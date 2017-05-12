//上传头像url
var headImgUrl;
//微信二维码Url
var weChatQrCode;
//当前个人信息
var selfInformation = new Object();
//公司信息
var companies;
//从数据库获取到的个人信息
var user = new Object();
//个人简介字数
var count;


//用户请求前缀
var userUrl = "http://192.168.1.72:8881/";

//文件请求前缀  "http://117.36.75.166:8882/"
var fileUrl = "http://192.168.1.72:8882/";

$(function () {
	$("#checkFirm").tap(function () {
		//$(".arrow-right").toggleClass('active')
		if($(".arrow-right").attr('class')=='arrow-right'){
			$(".arrow-right").addClass('active');
		}else{
			$(".arrow-right.active").removeClass('active');
		}
		// $("#children").stop()
		//$("#children").toggle("normal")
		if($("#children").css("display")=="none"){
			$("#children").show();
		}else{
			$("#children").hide();
		}
	})
	//发送ajax请求，获取全部公司信息
	$.ajax({
		url: userUrl + 'api/companyController/getCompanies',
		type: 'GET', //GET
		async: false,
		dataType: 'json', //返回的数据格式：json/xml/html/script/jsonp/text
		success: function (result) {
			if (result.returnValue == 'SUCCESS') {
				companies = result.object;
				for (var n in companies) {
					$("#children").append('<div class="children-firm">' + companies[n].name + '</div>');
				}
				selfInformation.company = companies[0];
				$("#lj-company").text(selfInformation.company.name);
			}

		},
		error: function (err) {
			alert(err.reason);
		}
	})


	// 公司点击
	$('#children').on('touchstart', '.children-firm', function () {
		$(this).on('touchmove', function (event) {
			$(this).off('touchend')
		})
		$(this).on('touchend', function (event) {
			$("#lj-company").text($(this).text())
			$("#children").hide();
			$(".arrow-right").removeClass('active')
			var companySelf = this
			selfInformation.company = companies.filter(function (v, i) {
				return v.name === $(companySelf).text()
			})[0];
		})
	})

	//从指云url获取个人信息
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
	selfInformation.name = decodeURI(getQueryStr("name"));
	selfInformation.position = decodeURI(getQueryStr("position"));
	selfInformation.employeeId = getQueryStr("code");
	selfInformation.email = getQueryStr("email");
	selfInformation.tel = getQueryStr("tel");
	$("#nameId").text(selfInformation.name);
	$("#telId").val(selfInformation.tel);
	$("#positionId").text(selfInformation.position);
	$("#emailId").text(selfInformation.email);

	//发送ajax请求，获取个人信息
	$.ajax({
		url: 'http://117.36.75.166:8881/api/userController/getUserByUserCode',
		type: 'GET', //GET
		data: {
			userCode: selfInformation.employeeId
		},
		dataType: 'json', //返回的数据格式：json/xml/html/script/jsonp/text
		success: function (result) {
			if (result.returnValue == 'SUCCESS') {
				var res = result.object;
				if (res.status == 1) {
					user = res.user[0];
					telNum = user.tel;
					if (user.headImgUrl) {
						$("#touxiang").css("backgroundImage", "url(" + user.headImgUrl + ")");
						headImgUrl = user.headImgUrl;
					}
					$("#nameId").text(user.name);
					selfInformation.name = user.name;
					selfInformation.company = user.company;
					$("#lj-company").text(user.company.name)
					$("#emailId").text(user.email);
					selfInformation.email = user.email;
					$("#positionId").text(user.position);
					selfInformation.position = user.position;
					$("#telId").val(user.tel);
					selfInformation.tel = user.tel;
					$("#weChatId").val(user.wechat);
					if (user.weChatQrCode) {
						$("#code").css("backgroundImage", "url(" + user.weChatQrCode + ")");
						weChatQrCode = user.weChatQrCode;
					}
					$("#personalId").val(user.personal);
					//计算个人简介字数
					count = (30 - $("#personalId").val().length);
					$("#characters").text(count);
				}
			}
		},
		error: function (err) {
			alert(err.reason);
		}
	})



	//微信号格式验证
	$("#weChatId").blur(function () {
		weChatVerify();
	});

	//手机号格式验证
	$("#telId").blur(function () {
		telVerify();
	});


	//保存提交
	$("#save").on('touchend', function () {
		saveCommit();
	});


})

//手机号格式验证
function telVerify() {
	var str = $("#telId").val();
	var ret = /^1[34578]\d{9}$/;
	if (str.length == 0) {
		$("#telId").val(selfInformation.tel);
		return true;
	} else {
		if (!ret.test(str)) {
			$("#telId").val(selfInformation.tel);
			return true;
		}
		return true;
	}
	return true;
}

//微信号格式验证
function weChatVerify() {
	var str = $("#weChatId").val();
	var ret = /^[a-zA-Z\d_]{5,}$/;
	if (str) {
		if (!ret.test(str)) {
			if(user.wechat){
				$("#weChatId").val(user.wechat);
			}else{
				$("#weChatId").val('')
				$("#weChatId").attr('placeholder', '微信号格式不正确');
			}		
		}
		return true;
	}
	return true;
}

function textareaFocus(params) {
	params.value = params.value.trim()
}

//上传头像
function uploadHeadImg(source) {
	var file = source.files[0];
	if (!file) {
		return;
	}
	var fireSize = file.size / 1024;
	if (fireSize < 100) {
		var myForm = new FormData();
		myForm.append("file", file);
		$.ajax({
			url: fileUrl + 'api/fileUploadController/upload',
			type: 'POST',
			data: myForm,
			contentType: false,
			processData: false,
			cache: false,
			dataType: 'json',
			success: function (result) {
				if (result.returnValue == 'SUCCESS') {
					headImgUrl = result.object;
					$("#touxiang").css("backgroundImage", "url(" + headImgUrl + ")");
				}
			},
			error: function (err) {
				console.log("上传失败   " + err.reason);
			}
		});
	} else {
		uploadCompressPhoto(file, function (data) {
			var formd = new FormData();
			formd.append("file", data, "file_" + Date.parse(new Date()) + ".jpeg");
			$.ajax({
				url: fileUrl + 'api/fileUploadController/upload',
				type: 'POST',
				async: false,
				data: formd,
				contentType: false,
				processData: false,
				cache: false,
				dataType: 'json',
				success: function (result) {
					if (result.returnValue == 'SUCCESS') {
						headImgUrl = result.object;
						$("#touxiang").css("backgroundImage", "url(" + headImgUrl + ")");			
					}
				},
				error: function (err) {
					console.log("上传失败   " + err.reason);
				}
			});
		})
	}

}


//压缩图片
function uploadCompressPhoto(file,callback) {
	var reader = new FileReader();
	reader.readAsDataURL(file);
	reader.onload = function (event) {
		var result = event.target.result;;
		var image = new Image();
		image.src = result;
		image.onload = function () {  //创建一个image对象，给canvas绘制使用  
			var cvs = document.createElement('canvas');
			var scale = 1;
			if (image.width > 800 || image.height > 800) {  //800只是示例，可以根据具体的要求去设定    
				if (image.width > image.height) {
					scale = 800 / image.width;
				} else {
					scale = 800 / image.height;
				}
			}
			cvs.width = image.width * scale;
			cvs.height = image.height * scale;     //计算等比缩小后图片宽高  
			var ctx = cvs.getContext('2d');
			ctx.drawImage(image, 0, 0, cvs.width, cvs.height);
			var newImageData = cvs.toDataURL(file.type, 0.8);   //重新生成图片，<span style="font-family: Arial, Helvetica, sans-serif;">fileType为用户选择的图片类型</span>  
			//将以base64的图片url数据转换为Blob
			var byteString = atob(newImageData.split(',')[1]);
			var mimeString = newImageData.split(',')[0].split(':')[1].split(';')[0];
			var ab = new ArrayBuffer(byteString.length);
			var ia = new Uint8Array(ab);
			for (var i = 0; i < byteString.length; i++) {
				ia[i] = byteString.charCodeAt(i);
			}
			callback(new Blob([ab], { type: mimeString }));
		}
	};
}


//上传微信二维码
function uploadWechatQrCode(source) {
	var file = source.files[0];
	if (!file) {
		return;
	}
	var fireSize = file.size / 1024;
	if (fireSize < 100) {
		var myForm = new FormData();
		myForm.append("file", file);
		$.ajax({
			url: fileUrl + 'api/fileUploadController/upload',
			type: 'POST',
			data: myForm,
			contentType: false,
			processData: false,
			cache: false,
			dataType: 'json',
			success: function (result) {
				if (result.returnValue == 'SUCCESS') {
					weChatQrCode = result.object;
					$("#code").css("backgroundImage", "url(" + weChatQrCode + ")");
				}
			},
			error: function (err) {
				console.log("上传失败   " + err.reason);
			}
		});
	} else {
		uploadCompressPhoto(file, function (data) {
			var formd = new FormData();
			formd.append("file", data, "file_" + Date.parse(new Date()) + ".jpeg");
			$.ajax({
				url: fileUrl + 'api/fileUploadController/upload',
				type: 'POST',
				async: false,
				data: formd,
				contentType: false,
				processData: false,
				cache: false,
				dataType: 'json',
				success: function (result) {
					if (result.returnValue == 'SUCCESS') {
						weChatQrCode = result.object;
					$("#code").css("backgroundImage", "url(" + weChatQrCode + ")");
						
					}
				},
				error: function (err) {
					console.log("上传失败   " + err.reason);
				}
			});
		})
	}
}


/*字数限制*/
$("#personalId").on("input propertychange", function () {
	var $this = $(this),
		_val = $this.val(),
		count = "";
	if (_val.length > 30) {
		$this.val(_val.substring(0, 30));
	}
	count = 30 - $this.val().length;
	$("#characters").text(count);
});


//保存提交
function saveCommit() {
	var formVerify = telVerify() && weChatVerify();
	if (!formVerify) {
		return;
	}
	var u = new Object();
	u.name = $("#nameId").text();
	u.company = selfInformation.company;
	u.email = $("#emailId").text();
	u.position = $("#positionId").text();
	u.tel = $("#telId").val();
	u.wechat = $("#weChatId").val();
	u.personal = $("#personalId").val();
	u.headImgUrl = headImgUrl;
	u.weChatQrCode = weChatQrCode;
	u.employeeId = selfInformation.employeeId;

	var user = JSON.stringify(u);
	console.log(user);
	$.ajax({
		url: userUrl + 'api/userController/saveUser',
		type: 'POST', //GET
		data: user,
		contentType: "application/json; charset=UTF-8",
		dataType: 'json', //返回的数据格式：json/xml/html/script/jsonp/text
		success: function (result) {
			if (result.returnValue == 'SUCCESS') {
				console.log(result.object);
			}
			previewClick();
		},
		error: function (err) {
			alert("ajax失败" + err.reason);
		}
	})

}

//预览界面
function previewClick() {
	console.log("预览" + selfInformation);
	var u = new Object();
	u.name = selfInformation.name;
	u.sex = selfInformation.sex;
	u.company = selfInformation.company;
	u.position = selfInformation.position;
	u.organization = selfInformation.organization;
	u.employeeId = selfInformation.employeeId;
	u.tel = $("#telId").val();
	u.personal = $("#personalId").val();
	u.wechat = $("#weChatId").val();
	u.qq = selfInformation.qq;
	u.email = selfInformation.email;
	if (!selfInformation.company) {
		u.companyDesc = selfInformation.company.companyDesc;
	}
	u.headImgUrl = headImgUrl;
	u.weChatQrCode = weChatQrCode;
	u.telQrCode = selfInformation.telQrCode;
	var user = JSON.stringify(u);
	localStorage.user = user;
	window.location.href = "index.html";
}