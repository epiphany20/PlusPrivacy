package eu.operando.lightning.activity;

import android.content.Intent;
import android.content.res.Configuration;
import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;
import android.support.v4.content.ContextCompat;
import android.support.v7.app.AppCompatActivity;

import javax.inject.Inject;

import eu.operando.R;
import eu.operando.PlusPrivacyApp;
import eu.operando.lightning.preference.PreferenceManager;
import eu.operando.lightning.utils.ThemeUtils;

public abstract class ThemableBrowserActivity extends AppCompatActivity {

    @Inject PreferenceManager mPreferences;

    private int mTheme;
    private boolean mShowTabsInDrawer;
    private boolean mShouldRunOnResumeActions = false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        PlusPrivacyApp.getAppComponent().inject(this);
        mTheme = mPreferences.getUseTheme();
        mShowTabsInDrawer = mPreferences.getShowTabsInDrawer(!isTablet());

        // set the theme
        if (mTheme == 1) {
            setTheme(R.style.Theme_DarkTheme);
        } else if (mTheme == 2) {
            setTheme(R.style.Theme_BlackTheme);
        }
        super.onCreate(savedInstanceState);

        resetPreferences();
    }

    private void resetPreferences() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            if (mPreferences.getUseBlackStatusBar()) {
                getWindow().setStatusBarColor(Color.BLACK);
            } else {
                getWindow().setStatusBarColor(ContextCompat.getColor(this, R.color.menu_5));//ThemeUtils.getStatusBarColor(this));
            }
        }
    }

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        if (hasFocus && mShouldRunOnResumeActions) {
            mShouldRunOnResumeActions = false;
            onWindowVisibleToUserAfterResume();
        }
    }

    /**
     * Called after the activity is resumed
     * and the UI becomes visible to the user.
     * Called by onWindowFocusChanged only if
     * onLoading has been called.
     */
    void onWindowVisibleToUserAfterResume() {

    }

    @Override
    protected void onResume() {
        super.onResume();
        resetPreferences();
        mShouldRunOnResumeActions = true;
        int theme = mPreferences.getUseTheme();
        boolean drawerTabs = mPreferences.getShowTabsInDrawer(!isTablet());
        if (theme != mTheme || mShowTabsInDrawer != drawerTabs) {
            restart();
        }
    }

    boolean isTablet() {
        return (getResources().getConfiguration().screenLayout & Configuration.SCREENLAYOUT_SIZE_MASK) == Configuration.SCREENLAYOUT_SIZE_XLARGE;
    }

    void restart() {
        finish();
        startActivity(new Intent(this, getClass()));
    }
}
