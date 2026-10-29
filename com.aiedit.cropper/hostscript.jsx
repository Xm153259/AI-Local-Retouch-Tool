#target photoshop
app.bringToFront();

function exportSelectionAndCrop() {
    var oldUnits = app.preferences.rulerUnits, source = null, temp = null;
    app.preferences.rulerUnits = Units.PIXELS;
    try {
        if (app.documents.length === 0) return "ERR:请先打开一个 Photoshop 文档！";
        source = app.activeDocument;
        var b;
        try { b = source.selection.bounds; }
        catch (selectionError) { return "ERR:请先使用矩形选框等工具创建有效选区！"; }

        var px = function(v) { return v.as("px"); };
        var left = Math.round(px(b[0])), top = Math.round(px(b[1]));
        var right = Math.round(px(b[2])), bottom = Math.round(px(b[3]));
        var cropW = right-left, cropH = bottom-top;
        if (cropW < 1 || cropH < 1) return "ERR:选区尺寸无效，请重新创建选区！";
        var origWidth = Math.round(px(source.width)), origHeight = Math.round(px(source.height));
        var outFolder = Folder.desktop;
        if (!outFolder.exists) outFolder = Folder("~/" + (Folder.fs === "Windows" ? "Desktop" : "Desktop"));
        if (!outFolder.exists) return "ERR:无法定位桌面文件夹！";

        var safeName = function(n) { return n.replace(/[\\\/:\*\?"<>\|]/g, "_"); };
        var base = safeName(source.name.replace(/\.[^\.]+$/, ""));
        var stem = base + "_AI局部_" + new Date().getTime();
        var pngFile = new File(outFolder.fsName + "/" + stem + ".png");
        var metaFile = new File(outFolder.fsName + "/" + stem + "_坐标.txt");

        temp = source.duplicate(stem + "_临时", false);
        app.activeDocument = temp;
        temp.crop([UnitValue(left,"px"),UnitValue(top,"px"),UnitValue(right,"px"),UnitValue(bottom,"px")]);
        temp.saveAs(pngFile, new PNGSaveOptions(), true, Extension.LOWERCASE);
        temp.close(SaveOptions.DONOTSAVECHANGES);
        temp = null;
        app.activeDocument = source;

        var idCrop = charIDToTypeID("Crop"), desc = new ActionDescriptor(), rect = new ActionDescriptor();
        rect.putUnitDouble(charIDToTypeID("Top "),charIDToTypeID("#Pxl"),top);
        rect.putUnitDouble(charIDToTypeID("Left"),charIDToTypeID("#Pxl"),left);
        rect.putUnitDouble(charIDToTypeID("Btom"),charIDToTypeID("#Pxl"),bottom);
        rect.putUnitDouble(charIDToTypeID("Rght"),charIDToTypeID("#Pxl"),right);
        desc.putObject(charIDToTypeID("T   "),charIDToTypeID("Rctn"),rect);
        desc.putUnitDouble(charIDToTypeID("Angl"),charIDToTypeID("#Ang"),0.0);
        desc.putBoolean(charIDToTypeID("Dlt "),false);
        executeAction(idCrop,desc,DialogModes.NO);

        var meta = "format=PS_AI_LOCAL_EDIT_V2\nsourceDocument="+source.name+
          "\ndocWidth="+origWidth+"\ndocHeight="+origHeight+"\nleft="+left+
          "\ntop="+top+"\nright="+right+"\nbottom="+bottom+"\ncropWidth="+cropW+
          "\ncropHeight="+cropH+"\n";
        metaFile.encoding="UTF8";
        if (!metaFile.open("w")) return "ERR:PNG 已导出，但坐标文件无法写入。";
        metaFile.write(meta); metaFile.close();
        return stem+".png；坐标记录："+stem+"_坐标.txt";
    } catch(e) {
        try { if(temp) temp.close(SaveOptions.DONOTSAVECHANGES); } catch(closeError) {}
        try { if(source) app.activeDocument=source; } catch(activeError) {}
        return "ERR:导出及裁切失败："+e.message;
    } finally { app.preferences.rulerUnits=oldUnits; }
}

function restoreOriginalSize() {
    var oldUnits = app.preferences.rulerUnits;
    app.preferences.rulerUnits = Units.PIXELS;
    try {
        if (app.documents.length === 0) return "ERR:当前没有打开的文档！";
        var source=app.activeDocument, sourceBaseName=source.name.replace(/\.[^\.]+$/,"");
        var outFolder=Folder.desktop;
        if(!outFolder.exists) outFolder=Folder("~/"+(Folder.fs==="Windows"?"Desktop":"Desktop"));
        var files=outFolder.getFiles(function(file){
            return file instanceof File && file.name.indexOf("_坐标.txt")!==-1 && file.name.indexOf(sourceBaseName)!==-1;
        });
        if(files.length===0){
            var allMetaFiles=outFolder.getFiles("*_坐标.txt");
            if(allMetaFiles.length>0){allMetaFiles.sort(function(a,b){return b.modified-a.modified;});files=[allMetaFiles[0]];}
        }
        if(files.length===0)return "ERR:桌面未找到坐标记录（*_坐标.txt），无法恢复！";
        var metaFile=files[0];metaFile.encoding="UTF8";
        if(!metaFile.open("r"))return "ERR:无法读取坐标文件："+metaFile.fsName;
        var content=metaFile.read();metaFile.close();
        var data={},lines=content.split(/\r?\n/);
        for(var i=0;i<lines.length;i++){var at=lines[i].indexOf("=");if(at>-1)data[lines[i].substring(0,at)]=lines[i].substring(at+1);}
        if(isNaN(parseInt(data.docWidth,10))||isNaN(parseInt(data.docHeight,10)))return "ERR:坐标记录格式无效！";
        var desc=new ActionDescriptor();
        executeAction(charIDToTypeID("RvlA"),desc,DialogModes.NO);
        return "SUCCESS";
    } catch(e){return "ERR:恢复原始画布范围失败："+e.message;}
    finally{app.preferences.rulerUnits=oldUnits;}
}
