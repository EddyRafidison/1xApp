package one.x;

import android.annotation.TargetApi;
import android.app.Activity;
import android.app.DownloadManager;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.res.Resources;
import android.graphics.Rect;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.view.ViewTreeObserver;
import android.view.Window;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;
import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.content.ContextCompat;
import one.x.databinding.ActivityMainBinding;

public class MainActivity extends AppCompatActivity {

  private ActivityMainBinding binding;
  private WebView web;
  private ValueCallback<Uri[]> mFilePathCallback;
  private ActivityResultLauncher<Intent> filePickerLauncher;

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    binding = ActivityMainBinding.inflate(getLayoutInflater());
    View view = binding.getRoot();
    setContentView(view);
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
      Window window = getWindow();
      window.setStatusBarColor(ContextCompat.getColor(this, R.color.status_bar_color));
    }
    web = binding.web;
    NetworkChecker network_ = new NetworkChecker(this);
    network_.registerNetworkCallback();
    registerReceiver(
        UpdateChecker.onDownloadComplete,
        new IntentFilter(DownloadManager.ACTION_DOWNLOAD_COMPLETE));
    Intent data_ = getIntent();
    if (data_ != null) {
      try {
        String version = data_.getStringExtra("version");
        String size = data_.getStringExtra("size");
        if (!version.isEmpty() && !size.isEmpty()) {
          UpdateChecker.checkAppVersion(this, version);
        }
      } catch (Exception ignored) {

      }
    }

    WebSettings ws = web.getSettings();
    ws.setJavaScriptEnabled(true);
    ws.setAllowContentAccess(true);
    ws.setAllowFileAccess(true);
    ws.setAllowFileAccessFromFileURLs(true);
    ws.setAllowUniversalAccessFromFileURLs(true);
    ws.setDomStorageEnabled(true);
    ws.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
    filePickerLauncher =
        registerForActivityResult(
            new ActivityResultContracts.StartActivityForResult(),
            result -> {
              Uri[] results = null;
              if (result.getResultCode() == Activity.RESULT_OK) {
                Intent data = result.getData();
                if (data.getClipData() != null) {
                  int count = data.getClipData().getItemCount();
                  results = new Uri[count];
                  for (int i = 0; i < count; i++) {
                    results[i] = data.getClipData().getItemAt(i).getUri();
                  }
                } else if (data.getData() != null) {
                  results = new Uri[] {data.getData()};
                }
              }
              mFilePathCallback.onReceiveValue(results);
              mFilePathCallback = null;
            });
    web.setWebChromeClient(
        new WebChromeClient() {
          @Override
          public boolean onShowFileChooser(
              WebView webView,
              ValueCallback<Uri[]> filePathCallback,
              FileChooserParams fileChooserParams) {
            mFilePathCallback = filePathCallback;

            final Intent intent = fileChooserParams.createIntent();
            intent.setType("image/*");
            intent.putExtra(Intent.EXTRA_ALLOW_MULTIPLE, true);
            try {
              filePickerLauncher.launch(intent);
            } catch (ActivityNotFoundException e) {
              filePathCallback = null;
              Toast.makeText(
                      MainActivity.this, getString(R.string.no_file_picker), Toast.LENGTH_SHORT)
                  .show();
              return false;
            }
            return true;
          }
        });
    web.addJavascriptInterface(new StringsToJS(this), "String");
    web.loadUrl(
        "file:///storage/emulated/0/Android/data/io.spck/files/One-X/app/src/main/assets/one-x/index.html");
    web.setWebViewClient(
        new WebViewClient() {
          @Override
          public boolean shouldOverrideUrlLoading(WebView view, String url) {
            return false;
          }

          @TargetApi(Build.VERSION_CODES.N)
          @Override
          public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
            return false;
          }
        });

    final View rootView = findViewById(android.R.id.content);
    rootView
        .getViewTreeObserver()
        .addOnGlobalLayoutListener(
            new ViewTreeObserver.OnGlobalLayoutListener() {
              @Override
              public void onGlobalLayout() {
                Rect r = new Rect();
                rootView.getWindowVisibleDisplayFrame(r);
                int screenHeight = rootView.getRootView().getHeight();
                int visibleHeight = r.height();
                int keyboardHeight = screenHeight - visibleHeight;
                int statusBH = getBarHeight("status_bar_height");
                int navBH = getBarHeight("navigation_bar_height");
                if (keyboardHeight > screenHeight * 0.15) {
                  String js =
                      "window.onViewHeight && window.onViewHeight("
                          + keyboardHeight
                          + ","
                          + screenHeight
                          + ","
                          + (statusBH + navBH)
                          + ");";
                  web.evaluateJavascript(js, null);
                } else {
                  web.evaluateJavascript("onKeyboardClosed()", null);
                }
              }
            });
    Utils.showAlertIfNoConnection(this, web);
  }

  private int getBarHeight(String param) {
    Resources resources = getResources();
    int resourceId = resources.getIdentifier(param, "dimen", "android");
    if (resourceId > 0) {
      return resources.getDimensionPixelSize(resourceId);
    }
    return 0;
  }
}
