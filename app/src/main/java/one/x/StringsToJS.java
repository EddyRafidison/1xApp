package one.x;

import android.content.Context;
import android.webkit.JavascriptInterface;

public class StringsToJS {
  Context context;

  public StringsToJS(Context context) {
    this.context = context;
  }

  @JavascriptInterface
  public String app_name() {
    return context.getString(R.string.app_name);
  }

  @JavascriptInterface
  public String no_connection() {
    return context.getString(R.string.no_connection);
  }

  @JavascriptInterface
  public String connect_error() {
    return context.getString(R.string.connect_error);
  }

  @JavascriptInterface
  public String install_error() {
    return context.getString(R.string.install_error);
  }

  @JavascriptInterface
  public String update_available_title() {
    return context.getString(R.string.update_available_title);
  }

  @JavascriptInterface
  public String update_available_text() {
    return context.getString(R.string.update_available_text);
  }

  @JavascriptInterface
  public String install() {
    return context.getString(R.string.install);
  }

  @JavascriptInterface
  public String download() {
    return context.getString(R.string.download);
  }

  @JavascriptInterface
  public String no_file_picker() {
    return context.getString(R.string.no_file_picker);
  }

  @JavascriptInterface
  public String username() {
    return context.getString(R.string.username);
  }

  @JavascriptInterface
  public String password() {
    return context.getString(R.string.password);
  }

  @JavascriptInterface
  public String secrete_phrase() {
    return context.getString(R.string.secrete_phrase);
  }

  @JavascriptInterface
  public String connection() {
    return context.getString(R.string.connection);
  }

  @JavascriptInterface
  public String login() {
    return context.getString(R.string.login);
  }

  @JavascriptInterface
  public String registration() {
    return context.getString(R.string.registration);
  }

  @JavascriptInterface
  public String signup() {
    return context.getString(R.string.signup);
  }

  @JavascriptInterface
  public String firstname() {
    return context.getString(R.string.firstname);
  }

  @JavascriptInterface
  public String lastname() {
    return context.getString(R.string.lastname);
  }

  @JavascriptInterface
  public String gender() {
    return context.getString(R.string.gender);
  }

  @JavascriptInterface
  public String birth() {
    return context.getString(R.string.birth);
  }

  @JavascriptInterface
  public String address() {
    return context.getString(R.string.address);
  }

  @JavascriptInterface
  public String country() {
    return context.getString(R.string.country);
  }

  @JavascriptInterface
  public String email() {
    return context.getString(R.string.email);
  }

  @JavascriptInterface
  public String phone() {
    return context.getString(R.string.phone);
  }

  @JavascriptInterface
  public String nci_passp() {
    return context.getString(R.string.nci_passp);
  }

  @JavascriptInterface
  public String new_password() {
    return context.getString(R.string.new_password);
  }

  @JavascriptInterface
  public String confirm_password() {
    return context.getString(R.string.confirm_password);
  }

  @JavascriptInterface
  public String user_agree() {
    return context.getString(R.string.user_agree);
  }

  @JavascriptInterface
  public String inputs_required() {
    return context.getString(R.string.inputs_required);
  }

  @JavascriptInterface
  public String nv_check_failed() {
    return context.getString(R.string.nv_check_failed);
  }
}
