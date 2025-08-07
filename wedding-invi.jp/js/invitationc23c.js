let g_ajax_checking_flag = false;

$(document).ready(function () {
    const INVITATION_GUEST_FORM = 'invitation_guest_form';

    if (window.location.pathname.startsWith('/invitation/') &&
        $('.c_invitation_guest_form').get(0) &&
        !$("[name='guest[family_name]']").val() &&
        !$("[name='guest[given_name]']").val() &&
        !$("[name='guest[family_name_kana]']").val() &&
        !$("[name='guest[given_name_kana]']").val() &&
        !$("[name='guest[email]']").val()
    ) {
        let jsonData = $.cookie(INVITATION_GUEST_FORM);
        if (jsonData) {
            let data = JSON.parse(jsonData);
            $("[name='guest[guest_type]'][value=" + data.guest_type + "]").prop('checked', true);
            $("[name='guest[family_name]']").val(data.family_name);
            $("[name='guest[given_name]']").val(data.given_name);
            $("[name='guest[family_name_kana]']").val(data.family_name_kana);
            $("[name='guest[given_name_kana]']").val(data.given_name_kana);
            $("[name='guest[sex]'][value=" + data.sex + "]").prop('checked', true);
            $("[name='guest[tel]']").val(data.tel);
            $("[name='guest[zipcode01]']").val(data.zipcode01);
            $("[name='guest[zipcode02]']").val(data.zipcode02);
            $("[name='guest[address]']").val(data.address);
            $("[name='guest[email]']").val(data.email);
            $("[name='guest[extra_second_party_take_flag]'][value=" + data.extra_second_party_take_flag + "]").prop('checked', true);
            $("[name='family_members[][joint_name]']").val(data.memo_allergy);
            $("[name='guest[custom_item_value1]']").val(data.custom_item_value1);
            $("[name='guest[custom_item_value2]']").val(data.custom_item_value2);
            $("[name='guest[custom_item_value3]']").val(data.custom_item_value3);

            // お連れ様
            if (data.family_members && $("[name='family_members[][joint_name]']:visible").get(0) && $("[name='family_members[][joint_name]']:eq(0)").val() == '') {
                let family_member_index = 0;
                $.each(data.family_members, function (tmp_index, family_member_element) {
                    if (!family_member_element.join_name) {
                        return true; // continue
                    }
                    if (family_member_index > 0) {
                        add_family_member_form();
                    }
                    $("[name='family_members[][joint_name]']:eq(" + family_member_index + ")").val(family_member_element.join_name);
                    $("[name='family_members[][memo_allergy]']:eq(" + family_member_index + ")").val(family_member_element.memo_allergy);
                    $("[name='family_members[][family_member_type]']:eq(" + family_member_index + ")").val(family_member_element.family_member_type);
                    family_member_index++;
                });
            }
        }
    }

    $('.c_invitation_guest_confirm_button').click(function () {
        let jsonData = {
            guest_type: $("[name='guest[guest_type]']:checked").val(),
            family_name: $("[name='guest[family_name]']").val(),
            given_name: $("[name='guest[given_name]']").val(),
            family_name_kana: $("[name='guest[family_name_kana]']").val(),
            given_name_kana: $("[name='guest[given_name_kana]']").val(),
            sex: $("[name='guest[sex]']:checked").val(),
            tel: $("[name='guest[tel]']").val(),
            zipcode01: $("[name='guest[zipcode01]']").val(),
            zipcode02: $("[name='guest[zipcode02]']").val(),
            address: $("[name='guest[address]']").val(),
            email: $("[name='guest[email]']").val(),
            memo_allergy: $("[name='guest[memo_allergy]']").val(),
            family_member_joint_name: $("[name='family_members[][joint_name]']").val(),
            extra_second_party_take_flag: $("[name='guest[extra_second_party_take_flag]']:checked").val(),
            custom_item_value1: $("[name='guest[custom_item_value1]']").val(),
            custom_item_value2: $("[name='guest[custom_item_value2]']").val(),
            custom_item_value3: $("[name='guest[custom_item_value3]']").val()
        };

        // お連れ様
        if ($("[name='family_members[][joint_name]']:visible").get(0)) {
            jsonData['family_members'] = [];
            $("[name='family_members[][joint_name]']").each(function (joint_name_index, joint_name_element) {
                if (!joint_name_element) {
                    return true; // continue
                }
                let join_name = $(joint_name_element).val();
                let memo_allergy = $("[name='family_members[][memo_allergy]']:eq(" + joint_name_index + ")").val();
                let family_member_type = $("[name='family_members[][family_member_type]']:eq(" + joint_name_index + ")").val();
                jsonData['family_members'].push({
                    join_name: join_name,
                    memo_allergy: memo_allergy,
                    family_member_type: family_member_type
                });
            });
        }

        $.cookie(INVITATION_GUEST_FORM, JSON.stringify(jsonData), {path: '/invitation', expires: 120});
    });

    // ゲスト画像アップロード
    $('#l_add_related_file_button').click(function () {
        add_related_file();
    });
    $('.c_related_file').each(function () {
        let i = $(this).attr('data-index');
        _init_cropper_image_for_related_file(this, i);
    });
});

function upload(file, file_index) {
    if (g_ajax_checking_flag) {
        alert('アップロード中です。しばらくお待ちください。');
        return;
    }
    let tmp_guest_id = $('#tmp_guest_id').val();
    if (!tmp_guest_id) {
        alert('不正なアクセスです。画面を更新してください。');
        return;
    }
    let party_info_id = $('#party_info_id').val();
    let auth_key = $('#auth_key').val();
    let fd = new FormData();
    fd.append('file', file);
    fd.append('party_info_id', party_info_id);
    fd.append('auth_key', auth_key);
    fd.append('image_type_index', file_index);
    fd.append('tmp_guest_id', tmp_guest_id);
    let postData = {
        type: "POST",
        dataType: "json",
        data: fd,
        processData: false,
        contentType: false
    };
    let error_message_selector = '#l_related_file_' + file_index + '_error';
    let tmp_image_flag_selector = '#l_related_file_' + file_index + '_tmp_flag';
    let preview_selector = '#l_related_file_' + file_index + '_preview';
    let uploading_selector = '#l_related_file_' + file_index + '_uploading';
    g_ajax_checking_flag = true;
    $(uploading_selector).show();
    $.ajax("/invitation/invitation_upload_image", postData).done(function (json) {
        $(error_message_selector).hide();
        if (json.message == 'OK') {
            $(tmp_image_flag_selector).val(1);
            $(preview_selector).attr('src', json.filename + '?v' + new Date().getTime());
            $(preview_selector).show();
        } else {
            $(error_message_selector).show();
        }
        g_ajax_checking_flag = false;
        $(uploading_selector).hide();
    });
}

function submit_attendance() {
    if (g_ajax_checking_flag) {
        alert('アップロード中です。しばらくお待ちください。');
        return false;
    }
    link_submit_and_click_check('guest_take_flag', $('input[name=attendance]:checked').val());
    return false;
}

function add_related_file() {
    let $last_related_file_group = $('.c_related_file_group:last');
    let $new_related_file_group = $($last_related_file_group.prop('outerHTML'));
    let new_index = Number($new_related_file_group.find('.c_related_file').attr('data-index')) + 1;

    $new_related_file_group.show();
    $new_related_file_group.attr({
        'id': 'l_related_file_' + new_index + '_group'
    });

    $new_related_file_group.find('.remove_img').attr({
        'id': 'l_related_file_' + new_index + '_remove_btn'
    });
    $new_related_file_group.find('.c_related_file_label').attr({
        'for': 'l_related_file_' + new_index + ''
    });
    let $related_file = $new_related_file_group.find('.c_related_file').attr({
        'id': 'l_related_file_' + new_index + '',
        'name': 'related_file_forms[' + new_index + '][file]',
        'data-index': '' + new_index + ''
    });
    $new_related_file_group.find('.c_related_preview').attr({
        'id': 'l_related_file_' + new_index + '_preview',
        'src': ''
    }).hide();
    $new_related_file_group.find('.err').attr({
        'id': 'l_related_file_' + new_index + '_error'
    }).hide();
    $new_related_file_group.find('.c_uploading').attr({
        'id': 'l_related_file_' + new_index + '_uploading'
    }).hide();
    $new_related_file_group.find('.c_related_file_form_name').attr({
        'name': 'related_file_forms[' + new_index + '][name]',
        'value': ''
    });
    $new_related_file_group.find('.c_related_file_form_index').attr({
        'name': 'related_file_forms[' + new_index + '][index]',
        'value': new_index
    });
    $new_related_file_group.find('.c_related_file_form_remove_flag').attr({
        'id': 'l_related_file_' + new_index + '_remove_flag',
        'name': 'related_file_forms[' + new_index + '][remove_flag]',
        'value': ''
    });
    $new_related_file_group.find('.c_related_file_form_tmp_flag').attr({
        'id': 'l_related_file_' + new_index + '_tmp_flag',
        'name': 'related_file_forms[' + new_index + '][tmp_flag]'
    });

    $last_related_file_group.after($new_related_file_group);
    _init_cropper_image_for_related_file($related_file[0], new_index);
}

function _init_cropper_image_for_related_file(file_element, index) {
    $('#l_related_file_' + index).unbind('change');
    $('#l_related_file_' + index).removeAttr('disabled');
    $('#l_related_file_' + index).change(function (e) {
        let file = $(this).prop('files')[0];
        let file_index = $(this).attr('data-index');
        upload(file, file_index);
    });
    $('#l_related_file_' + index + '_remove_btn').click(function (e) {
        remove_image_file(file_element.id);
        $('#l_related_file_' + index + '_group').hide();
        _check_add_related_file_button();
    });
    _check_add_related_file_button();
}

function _check_add_related_file_button() {
    if ($('.c_related_file_group:visible').length > 2) {
        $('#l_add_related_file_button').hide();
    } else {
        $('#l_add_related_file_button').show();
    }
}

function remove_image_file(target_id) {
    let selector_key = target_id.replace(/^l_/, '').replace(/_remove_btn$/, ''); // l_background_image1_remove_btn ->  background_image1
    let tmp_image_flag_selector = '#tmp_' + selector_key + '_flag'; // l_background_image1_flag
    let input_selector = '#l_' + selector_key + '_file'; // l_background_image1_file
    let preview_selector = '#l_' + selector_key + '_preview'; // l_background_image1_preview
    let remove_selector = '#l_' + selector_key + '_remove_flag';// l_background_image1_remove_flag

    $(tmp_image_flag_selector).val(0);
    $(input_selector).val('');
    $(preview_selector).hide();
    $(remove_selector).val(1);
}


