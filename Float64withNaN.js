const hex_index = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];

// Add trailing given character(s) on the given side of the
// given string to achieve the given length.
function Pad(str, length = 11, chr = '0', left = true) {
	str = str.toString();
	
	if (str.length >= length)
		return str;
	
	chr = chr.repeat(length - str.length);
	
	return left ? chr + str : str + chr;
}
// Base 10 to base 2. Also accomodates decimals (eg. 12.34).
function DecToBin(num, limit = 20) {
	if (num == 0)
		return '0';
	
	let str = '';
	let whl = Math.floor(num);
	let dec = num - whl;
	
	while (whl > 0) {
		str = (whl % 2) + str;
		whl = Math.floor(whl / 2);
	}
	
	if (dec > 0) {
		str += '.';
		
		for (let i = 0; dec > 0 && i < limit; i++) {
			dec *= 2;
			str += dec >= 1 ? '1' : '0';
			dec %= 1;
		}
	}
	
	return str;
}

// Base 2 to base 10.
// Automatically converted to integer.
function BinToDec(bin) {
	let num = 0;

	for (let i = 0; i < bin.length; i++)
		if (bin[bin.length - i - 1] === '1')
			num += 2 ** i;
		
	return num;
}

// Base 2 to base 16. Also accomodates decimals (eg. 101.01).
function BinToHex(bin) {
	let a = bin;
	let b = '';
	
	if (bin.includes('.')) {
		let arr = bin.split('.');
		a = arr[0];
		b = arr[1];
	}
	
	let an = a.length % 4;
	let bn = b.length % 4;
	
	if (an != 0)
		a = '0'.repeat(4 - an) + a;
	
	if (bn != 0)
		b = '0'.repeat(4 - bn) + b;
	
	let res = BinToHex_Internal(a);
	
	if (b.length > 0)
		res += '.' + BinToHex_Internal(b);
	
	return res;
}

function BinToHex_Internal(bin) {
	if (bin.length == 0)
		return '';
	
	return bin.match(/.{1,4}/g).map(v => hex_index[BinToDec(v)]).join('');
}

// Print result as object.
function Float64Result(sign, exponent, mantissa) {
	return {
		binary_representation: `${sign} ${exponent} ${mantissa}`,
		hex: BinToHex(sign + exponent + mantissa)
	}
}


// Float 32 to binary representation with hex.
// Example; -101.01x2^5 = Float64ToBin(1, '101', '01', 5)
// sign: 0 = positive; 1 = negative.
// bin: binary
// pow: power (2^n)
// overflowType: 0 = infinity; 1 = signaling NaN; 2 = quiet NaN

function Float64(sign, bin, pow, NaN) {
	if(NaN)
		return Float64Result(sign, '11111111111', '1111111111111111111111111111111111111111111111111111')
	// Special Case: Zero
	if (bin === '0')
		return Float64Result(sign, '00000000000', '0000000000000000000000000000000000000000000000000000');
	
	
	// Separate whole number and decimal.
	
	let a = bin;
	let b = '';
	
	if (bin.includes('.')) {
		let v = bin.split('.');
		a = v[0];
		b = v[1];
	}
	
	
	// Calculate E prime.


	let e = Math.min(1023 + parseInt(pow) + a.length - 1, 2047);

	
	if (e == 2047)
			
				return Float64Result(sign, '11111111111', '0000000000000000000000000000000000000000000000000000');
	
	
	// Special Case: Denormalized
	
	if (e <= 0) {
		a = '0'.repeat(1 - e) + a;
		e = 0;
	}
	
	
	// Calculate exponent and mantissa.
	
	let exponent = Pad(DecToBin(e));
	let mantissa = Pad((a.substr(1) + b).substr(0, 52), 52, '0', false);
	
	
	// Print result.
	
	return Float64Result(sign, exponent, mantissa);
}

function convert(){
	var inputnum = document.getElementById('inputnum');
	var inputpow = document.getElementById('inputpow');
	var bindisp = document.getElementById('bindisp');
	var hexdisp = document.getElementById('hexdisp');
	var sign = 0;
	res = false;
	pow = parseInt(inputpow.value);

	//check if it is negative
	if (inputnum.value.includes("-"))
	{
			sign = 1;
			str = inputnum.value.slice(1);
			console.log(str);
		}
		else
		str = inputnum.value;
	//Check if input is binary

	if (str.includes('.')) {
		let arr = str.split('.');
		a = arr[0];
		b = arr[1];
		if( /[^0-1]/.test(a) == true | /[^0-1]/.test(b) == true )
		res = true;

		//normalize the binary if it has only decimals
		if(a.length == 0 )	{	

		var c = '';
		var i =0;	
		var flag = 1;
		while(flag)
			{
				if(b[i] == '1')
				{
				a += b[i];
					i++;
				flag = 0;
				}
				else if(b[i] == '0')
				i++;
			}
			for(j=i-1; j< b.length-1 && j<52;j++)
				c += b[j+1];
	
			for (j= c.length; j<52;j++)
				c += '0';
			str = a + "." + c;
			pow  += (i * -1);
		}
		else if(parseInt(a) == 0)
		{
			
		var c = '';
		var i =0;	
		var flag = 1;
		while(flag)
			{
				if(b[i] == '1')
				{
				a = b[i];
					i++;
				flag = 0;
				}
				else if(b[i] == '0')
				i++;
			}
			for(j=i-1; j< b.length-1 && j<52;j++)
				c += b[j+1];
	
			for (j= c.length; j<52;j++)
				c += '0';
			str = a + "." + c;
			pow  += (i * -1);
		}
		}

	else
		res =  /[^x0-1]/.test(str);
	


	if(!res)
	{
	if (inputnum.value != '') {
		
		var res = Float64(sign,str,pow,res);

		bindisp.innerHTML = res.binary_representation;
		hexdisp.innerHTML = res.hex;
		
	}
}
else
{
	var res = Float64(0,0,0,res);

		bindisp.innerHTML = res.binary_representation;
		hexdisp.innerHTML = res.hex;
}

}

