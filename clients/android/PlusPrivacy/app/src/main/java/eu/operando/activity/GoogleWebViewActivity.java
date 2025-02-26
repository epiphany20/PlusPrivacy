package eu.operando.activity;

import android.content.Context;
import android.os.Bundle;
import android.view.View;
import android.webkit.CookieManager;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import eu.operando.customView.MyWebViewClient;

/**
 * Created by Alex on 2/16/2018.
 */

public class GoogleWebViewActivity extends SocialNetworkPrivacySettingsWebViewActivity {

    private int totalQuestions;
    private boolean shouldInjectUsualSettings = false;
//    private final String URL_MOBILE = "https://accounts.google.com/signin/v2/identifier?service=accountsettings&passive=1209600&osid=1&continue=https%3A%2F%2Fmyaccount.google.com%2Fintro%2Factivitycontrols&followup=https%3A%2F%2Fmyaccount.google.com%2Fintro%2Factivitycontrols&flowName=GlifWebSignIn&flowEntry=ServiceLogin";
    private final String URL_MOBILE = "https://myaccount.google.com/activitycontrols";
    private final String URL = "https://myaccount.google.com/activitycontrols";
    private final String PREFERENCES_URL = "https://www.google.com/preferences";


    public String getURL_MOBILE() {
        return URL_MOBILE;
    }

    public String getURL() {
        return URL;
    }

    @Override
    public WebViewClient getWebViewClient() {
        return new GoogleWebViewClient(this);
    }

    @Override
    public SocialNetworkPrivacySettingsWebViewActivity.WebAppInterface getWebAppInterface() {
        return new GoogleWebAppInterface(this, privacySettingsString);
    }

    @Override
    public String getJsFile() {
        return "google_preferences_settings.js";
    }

    @Override
    public String getIsLoggedJsFile() {
        return "google_is_logged.js";
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        totalQuestions = privacySettingsJSONArray.length();
    }

    public class GoogleWebViewClient extends MyWebViewClient {

        public GoogleWebViewClient(SocialNetworkInterface socialNetworkInterface) {
            super(socialNetworkInterface);
        }

        @Override
        public void onPageFinished(WebView view, String url) {
            super.onPageFinished(view, url);
            googlePageListener(url);
        }

        @Override
        public void onPageCommitVisible(WebView view, String url) {
            super.onPageCommitVisible(view, url);
            googlePageListener(url);
        }
    }

    public void googlePageListener(String url) {
        synchronized (mutex) {
            if (url.equals("https://myaccount.google.com/activitycontrols") &&
                    shouldInjectUsualSettings) {

                injectScriptFile("test_jquery.js");
                if (webAppInterface.getIsJQueryLoaded() == 0) {
                    injectScriptFile("jquery214min.js");
                }

                injectScriptFile("google_usual_settings.js");
                shouldInjectUsualSettings = false;
            }
        }
    }

    @Override
    public void startInjecting() {

        if (!shouldInject) {

//            setUserAgent();
            myWebView.loadUrl(PREFERENCES_URL);

            if (android.os.Build.VERSION.SDK_INT >= 21) {
                CookieManager.getInstance().setAcceptThirdPartyCookies(myWebView, true);
            } else {
                CookieManager.getInstance().setAcceptCookie(true);
            }

            shouldInject = true;

            initProgressDialog();
        }
    }

    public class GoogleWebAppInterface extends SocialNetworkPrivacySettingsWebViewActivity.WebAppInterface {

        private int index = 0;

        public GoogleWebAppInterface(Context context, String privacySettings) {
            super(context, privacySettings);
        }

        @JavascriptInterface
        public String getPreferencePrivacySettings() {
            return preferencesSettings.toString();
        }

        @JavascriptInterface
        public String getUsualPrivacySettings() {
            return usualSettings.toString();
        }

        @JavascriptInterface
        public String getActivityControlsSettings() {
            return activityControlsSettings.toString();
        }

        @JavascriptInterface
        public void onFinishedLoadingPreferenceSettings() {
            myWebView.post(new Runnable() {
                @Override
                public void run() {
                    shouldInjectUsualSettings = true;

                    myWebView.loadUrl("https://myaccount.google.com/activitycontrols");
                }
            });
        }

        @JavascriptInterface
        public void onFinishedLoadingUsualSettings() {
            myWebView.post(new Runnable() {
                @Override
                public void run() {

                    injectCssFile("activityControls.css");
                    injectScriptFile("google_activity_controls.js");
                }
            });
        }

        @JavascriptInterface
        public void dismissDialog() {

            frameLayout.post(new Runnable() {
                @Override
                public void run() {
                    frameLayout.setVisibility(View.GONE);
                }
            });
        }
    }
}