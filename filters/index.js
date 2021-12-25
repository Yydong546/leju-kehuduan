export function money(val){
	let num=String(val).indexOf(".")
	if(num!=-1){
		return num
	}
	let m=val/100;
	let moneyArr =String(m).split(".");
	if(moneyArr[1]){
		if(moneyArr[1].length==2){
			return m;
		}else{
			return moneyArr[0]+"."+moneyArr[1]+"0";
		}
	}else{
		return m+".00";
	}
}