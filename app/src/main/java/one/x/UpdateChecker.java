package one.x;

import android.app.AlertDialog;
import android.app.DownloadManager;
import android.content.ActivityNotFoundException;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Environment;
import android.widget.Toast;
import androidx.core.content.FileProvider;
import java.io.File;

public class UpdateChecker {
  private static long downloadId = -1;
  private static File apkFile;

  public static void checkForUpdate(Context context) {
    // implement method to check for new version from the server
    int serverVersionCode = 1;
    int currentVersionCode = getCurrentVersionCode(context);

    if (currentVersionCode < serverVersionCode) {
      new AlertDialog.Builder(context)
          .setTitle("Mise à jour disponible")
          .setMessage("Une nouvelle version de l'application est disponible.")
          .setPositiveButton(
              "Installer",
              (dialog, which) -> {
                installApk(context);
              })
          .setNegativeButton(
              "Télécharger",
              (dialog, which) -> {
                startApkDownload(context, "https://filesamples.com/samples/document/docx/sample4.docx");
              })
          .setCancelable(false)
          .show();
    }
  }

  private static int getCurrentVersionCode(Context context) {
    try {
      PackageManager pm = context.getPackageManager();
      PackageInfo pInfo = pm.getPackageInfo(context.getPackageName(), 0);
      return (int)
          (android.os.Build.VERSION.SDK_INT >= 28 ? pInfo.getLongVersionCode() : pInfo.versionCode);
    } catch (PackageManager.NameNotFoundException e) {
      e.printStackTrace();
      return -1;
    }
  }

  private static void startApkDownload(Context ctx, String url) {
    String fileName = "update.apk";
    File dest = new File(ctx.getExternalFilesDir(Environment.DIRECTORY_DOWNLOADS), fileName);
    apkFile = dest;

    DownloadManager.Request request = new DownloadManager.Request(Uri.parse(url));
    request.setDestinationUri(Uri.fromFile(dest));
    request.setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED);
    request.setMimeType("application/vnd.android.package-archive");

    DownloadManager manager = (DownloadManager) ctx.getSystemService(Context.DOWNLOAD_SERVICE);
    if (manager != null) {
      downloadId = manager.enqueue(request);
    }
  }

  public static final BroadcastReceiver onDownloadComplete =
      new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
          long id = intent.getLongExtra(DownloadManager.EXTRA_DOWNLOAD_ID, -1);
          if (id == downloadId && apkFile.exists()) {
            installApk(context);
          }
        }
      };

  private static void installApk(Context ctx) {
    String fileName = "update.apk";
    File file = new File(ctx.getExternalFilesDir(Environment.DIRECTORY_DOWNLOADS), fileName);
    try {
      Uri apkUri = FileProvider.getUriForFile(ctx, ctx.getPackageName() + ".provider", file);
      Intent install = new Intent(Intent.ACTION_VIEW);
      install.setDataAndType(apkUri, "application/vnd.android.package-archive");
      install.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_GRANT_READ_URI_PERMISSION);
      ctx.startActivity(install);
    } catch (ActivityNotFoundException e) {
      Toast.makeText(ctx, "Impossible d’installer le fichier", Toast.LENGTH_SHORT).show();
    }
  }
}
