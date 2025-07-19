package one.x;

import android.content.Context;
import android.net.ConnectivityManager;
import android.net.Network;
import android.os.Build;
import androidx.annotation.NonNull;

public class NetworkChecker {
  Context context;

  public NetworkChecker(Context context) {
    this.context = context;
  }

  // Network Check
  public void registerNetworkCallback() {
    try {
      ConnectivityManager connectivityManager =
          (ConnectivityManager) context.getSystemService(Context.CONNECTIVITY_SERVICE);

      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
        connectivityManager.registerDefaultNetworkCallback(
            new ConnectivityManager.NetworkCallback() {
              @Override
              public void onAvailable(@NonNull Network network) {
                APP.isNetworkON = true;
              }

              @Override
              public void onLost(@NonNull Network network) {
                APP.isNetworkON = false;
              }
            });
      }
    } catch (Exception e) {
      APP.isNetworkON = false;
    }
  }
}
