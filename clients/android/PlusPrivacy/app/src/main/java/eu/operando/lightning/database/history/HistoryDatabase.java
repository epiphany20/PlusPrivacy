/*
 * Copyright 2014 A.C.R. Development
 */
package eu.operando.lightning.database.history;

import android.app.Application;
import android.content.ContentValues;
import android.database.Cursor;
import android.database.DatabaseUtils;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.support.annotation.WorkerThread;

import java.util.ArrayList;
import java.util.List;

import javax.inject.Inject;
import javax.inject.Singleton;

import eu.operando.R;
import eu.operando.lightning.database.HistoryItem;

@Singleton
@WorkerThread
public class HistoryDatabase extends SQLiteOpenHelper {

    // All Static variables
    // Database Version
    private static final int DATABASE_VERSION = 2;

    // Database Name
    private static final String DATABASE_NAME = "historyManager";

    // HistoryItems table name
    private static final String TABLE_HISTORY = "history";

    // HistoryItems Table Columns names
    private static final String KEY_ID = "id";
    private static final String KEY_URL = "url";
    private static final String KEY_TITLE = "title";
    private static final String KEY_TIME_VISITED = "time";

    @Nullable private SQLiteDatabase mDatabase;

    @Inject
    HistoryDatabase(@NonNull Application application) {
        super(application, DATABASE_NAME, null, DATABASE_VERSION);
        mDatabase = HistoryDatabase.this.getWritableDatabase();
    }

    // Creating Tables
    @Override
    public void onCreate(@NonNull SQLiteDatabase db) {
        String CREATE_HISTORY_TABLE = "CREATE TABLE " + TABLE_HISTORY + '(' + KEY_ID
            + " INTEGER PRIMARY KEY," + KEY_URL + " TEXT," + KEY_TITLE + " TEXT,"
            + KEY_TIME_VISITED + " INTEGER" + ')';
        db.execSQL(CREATE_HISTORY_TABLE);
    }

    // Upgrading database
    @Override
    public void onUpgrade(@NonNull SQLiteDatabase db, int oldVersion, int newVersion) {
        // Drop older table if it exists
        db.execSQL("DROP TABLE IF EXISTS " + TABLE_HISTORY);
        // Create tables again
        onCreate(db);
    }

    @NonNull
    private static HistoryItem fromCursor(@NonNull Cursor cursor) {
        HistoryItem historyItem = new HistoryItem();
        historyItem.setUrl(cursor.getString(1));
        historyItem.setTitle(cursor.getString(2));
        historyItem.setImageId(R.drawable.ic_history);

        return historyItem;
    }

    @WorkerThread
    @NonNull
    private SQLiteDatabase lazyDatabase() {
        if (mDatabase == null || !mDatabase.isOpen()) {
            mDatabase = this.getWritableDatabase();
        }
        return mDatabase;
    }

    @WorkerThread
    synchronized void deleteHistory() {
        lazyDatabase().delete(TABLE_HISTORY, null, null);
        lazyDatabase().close();
    }

    @WorkerThread
    synchronized void deleteHistoryItem(@NonNull String url) {
        lazyDatabase().delete(TABLE_HISTORY, KEY_URL + " = ?", new String[]{url});
    }

    @WorkerThread
    synchronized void visitHistoryItem(@NonNull String url, @Nullable String title) {
        ContentValues values = new ContentValues();
        values.put(KEY_TITLE, title == null ? "" : title);
        values.put(KEY_TIME_VISITED, System.currentTimeMillis());

        Cursor cursor = lazyDatabase().query(false, TABLE_HISTORY, new String[]{KEY_URL},
            KEY_URL + " = ?", new String[]{url}, null, null, null, "1");

        if (cursor.getCount() > 0) {
            lazyDatabase().update(TABLE_HISTORY, values, KEY_URL + " = ?", new String[]{url});
        } else {
            addHistoryItem(new HistoryItem(url, title == null ? "" : title));
        }

        cursor.close();
    }

    @WorkerThread
    private synchronized void addHistoryItem(@NonNull HistoryItem item) {
        ContentValues values = new ContentValues();
        values.put(KEY_URL, item.getUrl());
        values.put(KEY_TITLE, item.getTitle());
        values.put(KEY_TIME_VISITED, System.currentTimeMillis());
        lazyDatabase().insert(TABLE_HISTORY, null, values);
    }

    @WorkerThread
    @Nullable
    synchronized String getHistoryItem(@NonNull String url) {
        Cursor cursor = lazyDatabase().query(TABLE_HISTORY, new String[]{KEY_ID, KEY_URL, KEY_TITLE},
            KEY_URL + " = ?", new String[]{url}, null, null, null, "1");
        String m = null;
        if (cursor != null) {
            cursor.moveToFirst();
            m = cursor.getString(0);

            cursor.close();
        }
        return m;
    }

    @WorkerThread
    @NonNull
    synchronized List<HistoryItem> findItemsContaining(@Nullable String search) {
        List<HistoryItem> itemList = new ArrayList<>(5);
        if (search == null) {
            return itemList;
        }

        search = '%' + search + '%';

        Cursor cursor = lazyDatabase().query(TABLE_HISTORY, null, KEY_TITLE + " LIKE ? OR " + KEY_URL + " LIKE ?",
            new String[]{search, search}, null, null, KEY_TIME_VISITED + " DESC", "5");

        while (cursor.moveToNext()) {
            itemList.add(fromCursor(cursor));
        }

        cursor.close();

        return itemList;
    }

    @WorkerThread
    @NonNull
    synchronized List<HistoryItem> getLastHundredItems() {
        List<HistoryItem> itemList = new ArrayList<>(100);
        Cursor cursor = lazyDatabase().query(TABLE_HISTORY, null, null, null, null, null, KEY_TIME_VISITED + " DESC", "100");

        while (cursor.moveToNext()) {
            itemList.add(fromCursor(cursor));
        }

        cursor.close();

        return itemList;
    }

    @WorkerThread
    @NonNull
    synchronized List<HistoryItem> getAllHistoryItems() {
        List<HistoryItem> itemList = new ArrayList<>();

        Cursor cursor = lazyDatabase().query(TABLE_HISTORY, null, null, null, null, null, KEY_TIME_VISITED + " DESC");

        while (cursor.moveToNext()) {
            itemList.add(fromCursor(cursor));
        }

        cursor.close();

        return itemList;
    }

    @WorkerThread
    synchronized long getHistoryItemsCount() {
        return DatabaseUtils.queryNumEntries(mDatabase, TABLE_HISTORY);
    }
}
