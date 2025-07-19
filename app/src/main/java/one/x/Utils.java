package one.x;

import android.content.Context;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.os.Build;
import android.view.View;
import android.widget.Toast;
import androidx.annotation.NonNull;
import com.android.volley.Request;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;
import com.google.android.material.snackbar.Snackbar;
import java.util.HashMap;
import java.util.Map;
import org.json.JSONException;
import org.json.JSONObject;

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

  private static JSONObject post(String[] keys, String[] value) {
    JSONObject jo = new JSONObject();
    int kl = keys.length;
    try {
      for (int i = 0; i < kl; i++) {
        jo.put(keys[i], value[i]);
      }
    } catch (JSONException ignored) {
    }
    return jo;
  }

  public static void connectToServer(
      Context ctx, String url, String[] keys, String[] values, final ServerListener slistener) {
    try {
      final JsonObjectRequest jsonObjectRequest =
          new JsonObjectRequest(
              Request.Method.POST,
              url,
              post(keys, values),
              response -> {
                slistener.onDataLoaded(response);
              },
              error -> {
                slistener.onConnectionError();
              }) {

            @NonNull
            @Override
            public Map<String, String> getHeaders() {
              // Build the headers
              final Map<String, String> params = new HashMap<>();
              params.put("Content-Type", "application/json");
              return params;
            }
          };
      Volley.newRequestQueue(ctx).add(jsonObjectRequest);
    } catch (Exception e) {
      slistener.onConnectionError();
    }
  }
}
