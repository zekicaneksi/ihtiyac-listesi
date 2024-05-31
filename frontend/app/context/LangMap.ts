export default interface LangMap {
  // Sign Page
  sign: {
    username_special: string;
    username_length: string;
    fullname_special: string;
    fullname_length: string;
    password_spaces: string;
    password_length: string;
    password_match: string;
    creating_user: string;
    username_exists: string;
    please_wait: string;
    invalid_credentials: string;
    unknown_error: string;
    username: string;
    password: string;
    password_again: string;
    fullname: string;
    login: string;
    register: string;
    or: string;
  };

  // Root (/) Page
  root_page: {
    room_name_length: string;
    room_password_space: string;
    room_password_length: string;
    room_password_match: string;
    creating_room: string;
    something_went_wrong: string;
    room_name: string;
    room_password: string;
    room_password_again: string;
    create: string;
    cancel: string;
    joining_room: string;
    room_not_found: string;
    room_incorrect_pass: string;
    room_already_member: string;
    room_something_went_wrong: string;
    room_id: string;
    join: string;
    copied_clipboard: string;
    fetching_credentials: string;
    connecting_realtime: string;
    logo_alt: string;
    join_room: string;
    create_room: string;
    no_room_info: string;
    create_or_join_info: string;
    loading_rooms: string;
  };

  // Profile page
  profile: {
    uploading: string;
    successful: string;
    file_size_big: string;
    something_went_wrong: string;
    logout: string;
    choose_file: string;
    upload: string;
  };

  // [room] page
  room: {
    check_room_exist: string;
    room_info: string;
    room_history: string;
    no_items_info: string;
    create_new_item_info1: string;
    create_new_item_info2: string;
    loading_items: string;
    added_by: string;
    bought_by: string;
    purchase_date: string;
    title_length: string;
    description_length: string;
    adding: string;
    something_went_wrong: string;
    title: string;
    description: string;
    add: string;
    will_buy: string;
    btn_will_buy: string;
    btn_will_not_buy: string;
    btn_bought: string;
    deleting: string;
    delete_inform: string;
    delete: string;
    cancel: string;
    editing: string;
    edit: string;
    loading_room: string;
    close_room: string;
    leave_room: string;
    members: string;
    closing_room: string;
    close_room_info: string;
    yes: string;
    no: string;
    leaving_room: string;
    leave_room_info: string;
    removing: string;
    remove_member_info: string;
    remove: string;
  };
}
