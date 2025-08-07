Date.prototype.format = function (f) {
  if (!this.valueOf()) return " ";
  var weekName = ["日", "月", "火", "水", "木", "金", "土"];
  var d = this;
  return f.replace(/(yyyy|yy|MM|dd|E|hh|mm|ss|a\/p)/gi, function ($1) {
    switch ($1) {
      case "yyyy":
        return d.getFullYear();
      case "yy":
        return (d.getFullYear() % 1000).zf(2);
      case "MM":
        return (d.getMonth() + 1).zf(2);
      case "dd":
        return d.getDate().zf(2);
      case "E":
        return weekName[d.getDay()];
      case "HH":
        return d.getHours().zf(2);
      case "hh":
        return ((h = d.getHours() % 12) ? h : 12).zf(2);
      case "mm":
        return d.getMinutes().zf(2);
      case "ss":
        return d.getSeconds().zf(2);
      case "a/p":
        return d.getHours() < 12 ? "午前" : "午後";
      default:
        return $1;
    }
  });
};
String.prototype.string = function (len) {
  var s = '', i = 0;
  while (i++ < len) {
    s += this;
  }
  return s;
};
String.prototype.zf = function (len) {
  return "0".string(len - this.length) + this;
};
Number.prototype.zf = function (len) {
  return this.toString().zf(len);
};

var clickFlag = false;

window.onpageshow = function(event) {
	clickFlag = false;
};

(function () {
  clickFlag = false;
  var init_check = function () {
    $(".check_item").click(function (e) {
      if (!$(e.target).is(":checkbox")) {
        $(this).find(':checkbox').prop('checked', function (i, value) {
          return !value;
        });
      }
    });
  };

  $(init_check); // onload
})();

function targetCheck(text, confirm_flag) {
  var check_count = 0;
  for (i = 0; i < document.guest_form.elements.length; i++) {
    if (document.guest_form.elements[i].checked) {
      check_count += 1;
    }
  }
  if (check_count == 0) {
    ui_alert(text + "する招待客を選択してください。");
    return false;
  }
  if (confirm_flag) {
    return ui_confirm("チェックした招待客を" + text + "します。", 'guest_form');
  } else {
    link_submit('guest_form');
    return false;
  }
}

function google_map_link() {
  try {
    var url = 'https://www.google.co.jp/maps?q=';
    var el = document.getElementById('party_info_form_prefecture_id');
    url += el.options[el.selectedIndex].innerHTML;
    el = document.getElementById('party_info_form_municipality_id');
    url += el.options[el.selectedIndex].innerHTML;
    url += document.getElementById('party_info_form_address').value;
    window.open(url);
    return true;
  } catch (e) {
    alert('住所が正しくありません。');
  }
  return false;
}

function select_submit(changeFlag) {
  if (changeFlag != "") {
    document.getElementById(changeFlag).value = "1";
  }
  link_submit();
}

function link_submit_add_param(id, value) {
  if (id != null && value != null) {
    document.getElementById(id).value = value;
  }
  link_submit();
}

function link_submit_and_click_check(id, value) {
  if (clickFlag) {
    alert('情報を送信中です。');
  } else {
    clickFlag = true;
    link_submit_add_param(id, value);
  }
}

function link_submit_click_check(form_name) {
  if (clickFlag) {
    alert('情報を送信中です。');
  } else {
    clickFlag = true;
    link_submit(form_name);
  }
}

function link_submit(form_name) {
  if (form_name == 'guest_form') {
    document.guest_form.submit();
  } else if (form_name == 'party_info_form' || form_name == undefined || form_name == '') {
    document.party_info_form.submit();
  } else {
    $("form[name=" + form_name + "]").submit();
  }
}

function link_form_submit(form_id, action_value) {
  if (action_value != '')
    $("#" + form_id).attr("action", action_value);
  $("#" + form_id).submit();
}

function link_form_submit_by_form_name(form_name, action_value) {
  if (action_value != '') {
    $("form[name=" + form_name + "]").attr("action", action_value);
  }
  if (clickFlag) {
    alert('情報を送信中です。');
  } else {
    clickFlag = true;
    $("form[name=" + form_name + "]").submit();
  }
}

function show_n_hide(id) {
  $("#" + id).slideToggle();
  $("#" + id + "_text").toggle();
}

function no_submit(event) {
  if (event.keyCode == 13) {
    return false;
  }
}

function ui_alert(message, width) {
  $("#dialog-message-alert").html(message);
  if (width) {
    $("#dialog-message").dialog({
      modal: true,
      minHeight: 'auto',
      width: width,
      buttons: {
        "OK": function () {
          $(this).dialog("close");
        }
      }
    });
  } else {
    $("#dialog-message").dialog({
      modal: true,
      minHeight: 'auto',
      width: 'auto',
      buttons: {
        "OK": function () {
          $(this).dialog("close");
        }
      }
    });
  }
  $(".ui-dialog-titlebar").hide();
}

function ui_confirm_delete_manager(name, guest_id, user_party_info_id) {
  add_field = "<input type='hidden' name='guest_id' value='" + guest_id + "'>";
  if (user_party_info_id != null)
    add_field += "<input type='hidden' name='user_party_info_id' value='" + user_party_info_id + "'>";
  $("#hidden_field").html(add_field);
  return ui_confirm(name + "様の登録を解除します。", 'guest_form');
}

function ui_confirm_delete_guest(name, guest_id, party_info_id) {
	add_field = "<input type='hidden' name='guest_id' value='" + guest_id + "'>";
	if (party_info_id != null)
		add_field += "<input type='hidden' name='party_info_id' value='" + party_info_id + "'>";
	$("#hidden_field").html(add_field);
	return ui_confirm(name + "を削除します。", 'delete_guest_form');
}

function change_user_type(url, party_info_id, user_party_info_id, this_element, user_type_man, user_type_woman, use_type_manager) {
  var user_type = this_element.value;
  if (false && (user_type == user_type_man || user_type == user_type_woman)) { // TODO false 撤去
    $("#dialog-message-confirm").html("選択したメンバー情報をパーティの" + (user_type == user_type_man ? "新郎" : "新婦") + "情報に反映しますか？");
    $("#dialog-confirm").dialog({
      resizable: false,
      //width: 230,
      modal: true,
      buttons: {
        "はい": function () {
          _reset_user_type(this_element, user_type, use_type_manager);
          _change_user_type(this_element, url, party_info_id, user_party_info_id, user_type, 1);
          $(this).dialog("close");
          return false;
        },
        "いいえ": function () {
          _reset_user_type(this_element, user_type, use_type_manager);
          _change_user_type(this_element, url, party_info_id, user_party_info_id, user_type, 0);
          $(this).dialog("close");
          return false;
        }
      }
    });
    $(".ui-dialog-titlebar").hide();
  } else {
    _change_user_type(this_element, url, party_info_id, user_party_info_id, user_type, 0);
  }
}

function _change_user_type(this_element, url, party_info_id, user_party_info_id, user_type, change_party_info_flag) {
  $.ajax({
    type: "POST",
    url: url,
    data: {
      authenticity_token: $("input[name=authenticity_token]").val(),
      party_info_id: party_info_id,
      user_party_info_id: user_party_info_id,
      user_type: user_type,
      change_party_info_flag: change_party_info_flag
    },
    success: function () {
      if (user_type == 0 || user_type == 1) { // 変更したユーザーの USER_TYPE が新郎・新婦の場合、他の新郎・新婦を幹事に変更
        $(".c_user_type").each(function(){
          if (this != this_element && $(this).val() == user_type) {
           $(this).val(2);
          }
        })
      }
      ui_dialog("役割を変更しました。", "60%");
    }
  });
}

function _reset_user_type(this_element, target_user_type, user_type_manager) {
  $(".c_user_type").each(function () {
    if (this_element != this && $(this).val() == target_user_type) {
      $(this).val(user_type_manager);
    }
  });
}


function ui_dialog(message, width) {
  if (!width) {
    width = '300px';
  }
  $("#dialog-message-confirm").html(message);
  $("#dialog-confirm").dialog({
    resizable: false,
    width: width,
    modal: true,
    buttons: {
      "OK": function () {
        $(this).dialog("close");
        return false;
      }
    }
  });
  $(".ui-dialog-titlebar").hide();
}

function ui_confirm(message, action_type, location_href) {
  $("#dialog-message-confirm").html(message);
  $("#dialog-confirm").dialog({
    resizable: false,
    width: '70%',
    modal: true,
    buttons: {
      "OK": function () {
        $(this).dialog("close");
        var pattern = /^delete_email_/;
        if (action_type == 'guest_form') {
          link_submit('guest_form');
        } else if (action_type == 'delete_guest_form') {
	        link_submit('delete_guest_form');
        } else if (action_type == 'delete_user') {
          link_submit_add_param('delete', '1');
        } else if (pattern.test(action_type)) {
          $("#hidden_field").html("<input type='hidden' name='" + action_type + "' value='1'>");
          link_submit('party_info_form');
        } else if (location_href) {
          location.href = location_href;
        }
      },
      "キャンセル": function () {
        $(this).dialog("close");
        return false;
      }
    }
  });
  $(".ui-dialog-titlebar").hide();
  return false;
}

function set_comma(n) {
  var reg = /(^[+-]?\d+)(\d{3})/;
  n += '';
  while (reg.test(n))
    n = n.replace(reg, '$1' + ',' + '$2');
  return n;
}

// zipcodeから住所を検索してaddressに入れる
function get_address_from_zipcode(context_path, zipcode01_id, zipcode02_id, address_id) {
  if (zipcode01_id != null && zipcode02_id != null && address_id != null) {
    $.ajax({
      url: context_path + "/api/get_address",
      type: "POST",
      data: {
        authenticity_token: $("input[name=authenticity_token]").val(),
        zipcode01: $('#' + zipcode01_id).val(),
        zipcode02: $('#' + zipcode02_id).val()
      },
      success: function (data) {
        if (data == "") {
          ui_dialog("郵便番号に一致する住所は存在しません。", "60%");
        }
        document.getElementById(address_id).value = data;
      },
      error: function (data) {
        alert("通信エラーが発生しました。時間をおいてもう一度操作をおこなってください。")
      }
    })
  }
}

function update_party_edit_at(url, party_info_id) {
  var authenticity_token = $("input[name=authenticity_token]").val();
  if (authenticity_token != undefined) {
    $.ajax({
      type: "POST",
      url: url,
      data: {
        authenticity_token: authenticity_token,
        party_info_id: party_info_id
      },
      success: function () {
      }
    });
  }
}

function get_param(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function exec_copy(string) {
  var tmp = document.createElement("div");
  var pre = document.createElement('pre');

  // 親要素のCSSで user-select: none だとコピーできないので書き換える
  pre.style.webkitUserSelect = 'auto';
  pre.style.userSelect = 'auto';

  tmp.appendChild(pre).textContent = string;

  var s = tmp.style;
  s.position = 'fixed';
  s.right = '200%';

  document.body.appendChild(tmp);
  document.getSelection().selectAllChildren(tmp);
  var result = document.execCommand("copy");
  document.body.removeChild(tmp);

  return result;
}

/* FVの高調整 */
(function() {
  function setVH() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }
  setVH();

  // iosのスクロールでresize発生を回避
  let currentWidth = window.innerWidth;
  window.addEventListener("resize", function() {
      if (currentWidth == window.innerWidth) {
          return;
      }
      currentWidth = window.innerWidth;
      setVH();
  }, { passive:true });
})();

/**
 * ギャラリー一覧 
 */
jQuery(function($){
  if (!$('#l_action_design_flag').val()) {
    return; // action_designではない場合は実行しない
  }
  /* slick設定 */
  $('.gallery-slick').slick({
    slidesToShow: 3,
    slidesToScroll: 1,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 3000,
    speed: 400,
    centerMode: false,
    centerPadding: '50.5px',
    dots: true,
    prevArrow: false,
    nextArrow: false,
    responsive: [
      {
        breakpoint: 751,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: true,
        }
      }
    ]
  });

  /* ポップアップ */
  var current = '';
  var $item = '';
  var $click_item = $('.tm-Message-gallery__list-item'); // クリックアイテム
  
  // スワイプ・ドラッグでポップアップするのを無効
  $('.gallery-slick').on('swipe', function(){
    $click_item.addClass('swipeNow');
  });
  // タッチイベント時は解除
  $click_item.on('touchstart', function(){
    $click_item.removeClass('swipeNow');
  });

  // ギャラリー画像クリックでモーダルを開く
  $click_item.on('click', openModal);
  // モーダル画像以外クリックで閉じる
  $(document).on('click', '.photo-gallery-popup', closeModal);

  /**
   * モーダルを開く
   */
  function openModal( event ) {
    $item = $(this);
    current = $item.data('modal-index');
    $('.gallery-slick').slick('slickPause'); //ポップアップ中は自動スライド停止

    if (!$item.hasClass('swipeNow')) {
      var img = $item.find('img').attr('src');
      // ポップアップコンテンツ
      // 要素が1つの場合は矢印なし
      $('body').append('<article class="photo-gallery-popup"><div class="photo-gallery-popup__content"><img src="' + img + '"><span class="close-btn"></span></div></article>').css({ 'overflow': 'hidden' });
    } else {
      $click_item.removeClass('swipeNow');
    }
  }

  /**
   * モーダルを閉じる
   */
  function closeModal( event ) {
    if (!$(event.target).closest('.photo-gallery-popup__pic').length) {
      $('.photo-gallery-popup').remove();
      $('body').css({ 'overflow': 'unset' });
      $('.gallery-slick').slick('slickPlay'); //ポップアップ閉じると自動スライド開始
    }
  }

  /**
   * お問い合わせのフェードイン
   */
  var fead_item = $('#poa .aos-init');
  fead_item.each(function(index){
    var this_item = $(this).data('aos');
    $(window).scroll(function(){
      var scroll_item = fead_item.eq(index).attr('data-aos', this_item).offset().top;
      var window_scroll = $(this).scrollTop();
      var fead_in = scroll_item - window_scroll;
      if ( fead_in < ($(window).height() / 2) ) {
        fead_item.eq(index).addClass('aos-animate');
      } else {
        return false;
      }
    });
  });
});

function init_placeholder(displayed_allergy) {
  if (displayed_allergy == "false") {
    $("input[name='family_members[][memo_allergy]']").hide();
  }
  $("input[name='family_members[][joint_name]']").map(function (i, e) {
    $(e).attr('placeholder', 'お連れ様のお名前');
  });
  $("input[name='family_members[][memo_allergy]']").map(function (i, e) {
    $(e).attr('placeholder', 'お連れ様アレルギー詳細');
  });
}
