package one.x;

import android.content.Context;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.os.Build;
import android.view.View;
import com.google.android.material.snackbar.Snackbar;

public class Utils {
  public static void showAlertIfNoConnection(Context ctx, View v) {
    if (!APP.isNetworkON) {
      Snackbar sb = Snackbar.make(v, ctx.getString(R.string.no_connection), Snackbar.LENGTH_LONG);
      sb.setAction("Ok", v1 -> sb.dismiss());
      sb.show();
    }
  }

  public static boolean isNetworkAvailable(Context ctx) {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
      return APP.isNetworkON;
    } else {
      ConnectivityManager connectivityManager =
          (ConnectivityManager) ctx.getSystemService(Context.CONNECTIVITY_SERVICE);
      if (connectivityManager != null) {
        NetworkInfo activeNetwork = connectivityManager.getActiveNetworkInfo();
        APP.isNetworkON = activeNetwork != null && activeNetwork.isConnected();
      }
    }
    return APP.isNetworkON;
  }
}
