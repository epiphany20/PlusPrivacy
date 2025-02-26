package eu.operando.swarmclient.models;

import android.util.Log;

import com.google.gson.Gson;

import org.json.JSONObject;

import java.lang.reflect.ParameterizedType;

/**
 * Created by Edy on 11/3/2016.
 */

public abstract class SwarmCallback<T extends Swarm> {
    private String resultEvent;
    private Class<? extends T> type;

    public Class<? extends T> getType() {
        return type;
    }

    @SuppressWarnings("unchecked")
    public SwarmCallback() {
        this.type = (Class<T>)((ParameterizedType)getClass().getGenericSuperclass()).getActualTypeArguments()[0];
        Log.e("SwarmCallback type", type.getName());
    }

    public void setResultEvent(String resultEvent) {
        this.resultEvent = resultEvent;
    }

    public String getResultEvent() {
        return resultEvent;
    }

    public abstract void call(final T result);

    public void result(JSONObject result) {
        Log.e("swclient Swarms: ", "getResult: " + result.toString() );
        T t = new Gson().fromJson(result.toString(),type);
        call(t);
    }
}
