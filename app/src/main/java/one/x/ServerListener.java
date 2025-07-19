package one.x;

import org.json.JSONObject;

public interface ServerListener {
  void onDataLoaded(JSONObject response);
  void onConnectionError();
}
