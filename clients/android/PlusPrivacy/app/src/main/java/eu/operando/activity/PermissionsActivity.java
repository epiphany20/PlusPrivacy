package eu.operando.activity;

import android.content.Context;
import android.content.Intent;
import android.graphics.drawable.ColorDrawable;
import android.os.Bundle;
import android.support.v4.content.ContextCompat;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.view.MenuItem;
import android.view.View;
import android.widget.ListView;

import eu.operando.R;
import eu.operando.adapter.PermissionsListAdapter;

/**
 * Created by Edy on 6/17/2016.
 */
public class PermissionsActivity extends BaseActivity {
//    public static void start(Context context) {
//        Intent starter = new Intent(context, PermissionsActivity.class);
//        context.startActivity(starter);
//    }
    private int colorId;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_permissions);

        colorId = getIntent().getExtras().getInt("color");
        //Todo: use color id
        setToolbar();

        ListView listView = (ListView) findViewById(R.id.lv);
        if (listView != null) {
            if (getIntent().getStringArrayListExtra("perms") != null && getIntent().getStringArrayListExtra("perms").size() != 0) {
                listView.setAdapter(new PermissionsListAdapter(this, getIntent().getStringArrayListExtra("perms"), colorId));
            }
        }
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        if (item.getItemId() == android.R.id.home) {
            onBackPressed();
        }
        return super.onOptionsItemSelected(item);
    }

    private void setToolbar() {

        Toolbar toolbar = (Toolbar) findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);
        if (colorId != 0){
            getSupportActionBar().setBackgroundDrawable(new ColorDrawable(
                    ContextCompat.getColor(this, colorId)));
        }
        getSupportActionBar().setDisplayHomeAsUpEnabled(true);
    }
}
