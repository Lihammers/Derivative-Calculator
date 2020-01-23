window.onload = function() {
    $("enter").onclick = clicked;
    $("polynomial").observe("keyup", typing);
};

let eq = "";

function clicked() {
    let poly = $("polynomial");
    let output = $("outputs");
    //output.innerHTML = "f'(x) = " + derive(eq);
    let check = checkPolynomial(poly.value);
    if (!check) {
        output.style.color = "red";
        output.innerHTML = "Error inproper input for polynomial";
    }
    else {
        output.style.color = "black";
        output.innerHTML = "f'(x) = " + derive(eq);
    }
}

function checkPolynomial(string) {
    string.replace(/ /,"");

    if (string.match(/[^+x0-9.\^-]/g) != null) {
        return false;
    }
    else if (string.match(/x[0-9.]/g) != null) {
        return false;
    }
    else if ($("polynomial").value.match(/\/[\/*.^]+/g) != null) {

    }

    return true;
}

function typing() {
    let input = $("polynomial").value;
    let type = $("typed");
    type.innerHTML = "f(x) = " + simplify(input);
    type.stopObserving("keyup");
}

function convertExponents(equation) {
    var regEx = /[xX][\^][-]?[0-9]+([.][0-9]+)?/g;
    var matches = equation.match(regEx);

    for (let i = 0; i < matches.length;i++)
            equation = equation.replace(matches[i], "x" + "<sup>" + matches[i].substr(2, matches[i].length) + "</sup>");

    return equation;
}

function convertFractiontoDecimal(equation) {
    var placeHold = equation.match(/([-]?[0-9]+([.][0-9]+)?)?[x]?([\^][-]?[0-9]+([.][0-9]+)?)?([/]([-]?[0-9]+([.][0-9]+)?)?[x]?([\^][-]?[0-9]+([.][0-9]+)?)?)+/g);

    for (let i = 0; i < placeHold.length; i++) {
        if (placeHold[i].charAt(0) === 'x')
            equation = equation.replace(placeHold[i], "1" + placeHold[i]);
    }

    for (let i = 0; i < placeHold.length; i++) {
        var dup = placeHold[i];
        var removeExpo = dup.replace(/[\^][-]?[0-9]+([.][0-9]+)?/g, "");
        var match = removeExpo.match(/[-]?[0-9]+([.][0-9]+)?/g);
        var expos = dup.match(/x([\^][-]?[0-9]+([.][0-9]+)?)?/g);
        var result = parseFloat(match[0]);

        for (let j = 1; j < match.length; j++) {
            if (match != null)
                result /= parseFloat(match[j]);
        }

        dup = result.toString();

        if (expos != null) {
            dup += expos[0];
            for (let j = 1; j < expos.length; j++) {
                dup += "/" + expos[j];
            }
        }

        equation = equation.replace(placeHold[i], dup);
    }

    return equation;
}

function simplify(equation) {
    equation = equation.replace(/X/g, "x");
    equation = equation.replace(/ /g,"");
    if (equation.charAt(0) === 'x')
        equation = "1" + equation;
    equation = equation.replace(/[+]x/g,"+1x");
    equation = equation.replace(/[-]x/g,"-1x");
    equation = equation.replace(/[*]x/g, "*1x");
    equation = equation.replace(/[/]x/g, "/1x");

    var regExpo = equation.match(/[0-9]+([.][0-9]+)?([\^][0-9]+([.][0-9]+)?)+/g);

    if (regExpo != null) {
        for (let i = 0; i < regExpo.length; i++) {
            var numbers = regExpo[i].match(/[0-9]+([.][0-9]+)?/g);
            var pow = parseFloat(numbers[0]);

            for (let j = 1; j < numbers.length; j++) {
                pow = Math.pow(pow, parseFloat(numbers[j]));
            }

            equation = equation.replace(regExpo[i], pow);
        }
    }

    if (equation.match(/([-]?[0-9]+([.][0-9]+)?)?[x]?([\^][-]?[0-9]+([.][0-9]+)?)?([/]([-]?[0-9]+([.][0-9]+)?)?[x]?([\^][-]?[0-9]+([.][0-9]+)?)?)+/g) != null)
       equation = convertFractiontoDecimal(equation);

    var regMulti = equation.match(/([-]?[0-9]+([.][0-9]+)?)?[x]?([\^][-]?[0-9]+([.][0-9]+)?)?([*]([-]?[0-9]+([.][0-9]+)?)?[x]?([\^][-]?[0-9]+([.][0-9]+)?)?)+/g);
    if (regMulti != null) {
        for (let i = 0; i < regMulti.length; i++) {
            var dup = regMulti[i];
            var removeExpo = dup.replace(/[\^][-]?[0-9]+([.][0-9]+)?/g, "");
            var match = removeExpo.match(/[-]?[0-9]+([.][0-9]+)?/g);
            var expos = dup.match(/x([\^][-]?[0-9]+([.][0-9]+)?)?/g);
            var num = 1;

            for (let j = 0; j < match.length; j++){
                if (match != null)
                     num *= parseFloat(match[j]);
            }

            dup = "" + num.toString();

            if (expos != null) {
                dup += expos[0];
                for (let j = 1; j < expos.length; j++) {
                    dup += "*" + expos[j];
                }
            }

            equation = equation.replace(regMulti[i], dup);
        }
    }

    if  (equation.match(/([-]?[0-9]+([.][0-9]+)?)?x([\^][-]?[0-9]+([.][0-9]+)?)?([/*][x]([\^][-]?[0-9]+([.][0-9]+)?)?)+/g) != null)
        equation = simplifyVariables(equation);

    //equation = onesAndZeroes(equation);
    eq = equation;
    if (equation.match(/[xX][\^][-]?[0-9]+([.][0-9]+)?/g) != null)
        equation = convertExponents(equation);


    return equation;
}

function simplifyVariables(equation) {
    let duplicate = equation;
    let regexMulti = duplicate.match(/([-]?[0-9]+([.][0-9]+)?)?x([\^][-]?[0-9]+([.][0-9]+)?)?([*]([-]?[0-9]+([.][0-9]+)?)?[x]([\^][-]?[0-9]+([.][0-9]+)?)?)+/g);

    if (regexMulti != null) {
        for (let i = 0; i < regexMulti.length; i++) {
            let individual = regexMulti[i].match(/([-]?[0-9]+([.][0-9]+)?)?x([\^][-]?[0-9]+([.][0-9]+)?)?/g);
            let num = regexMulti[i].match(/[-]?[0-9]+([.][0-9]+)?x/g);
            let result = 0;

            for (let j = 0; j < individual.length; j++) {
                if (individual[j].charAt(individual[j].length - 1) === 'x')
                    individual[j] = individual[j].replace('x', 'x^1');
            }

            for (let k = 0; k < individual.length; k++) {
                let power = individual[k].match(/[\^][-]?[0-9]+([.][0-9]+)?/g);
                result += parseFloat(power[0].substr(1, power[0].length));
            }

            if (result === 1)
                duplicate = duplicate.replace(regexMulti[i], num[0].substr(0, num[0].length - 1) + "x^1");
            else
                duplicate = duplicate.replace(regexMulti[i], num[0].substr(0, num[0].length - 1) + "x^" + result);
        }
    }

    let regexDivid = duplicate.match(/([-]?[0-9]+([.][0-9]+)?)?x([\^][-]?[0-9]+([.][0-9]+)?)?([/]([-]?[0-9]+([.][0-9]+)?)?[x]([\^][-]?[0-9]+([.][0-9]+)?)?)+/g);

    if (regexDivid != null) {
        for (let i = 0; i < regexDivid.length; i++) {
            let individual = regexDivid[i].match(/([-]?[0-9]+([.][0-9]+)?)?x([\^][-]?[0-9]+([.][0-9]+)?)?/g);
            let num = regexDivid[i].match(/[-]?[0-9]+([.][0-9]+)?x/g);

            for (let j = 0; j < individual.length; j++) {
                if (individual[j].charAt(individual[j].length - 1) === 'x')
                    individual[j] = individual[j].replace('x', 'x^1');
            }

            let m = individual[0].match(/[\^][-]?[0-9]+([.][0-9]+)?/g);
            let result = parseFloat(m[0].substr(1, m[0].length));

            for (let k = 1; k < individual.length; k++) {
                let power = individual[k].match(/[\^][-]?[0-9]+([.][0-9]+)?/g);
                result -= parseFloat(power[0].substr(1, power[0].length));
            }

            if (result === 1)
                duplicate = duplicate.replace(regexDivid[i], num[0].substr(0, num[0].length - 1) + "x^1");
            else
                duplicate = duplicate.replace(regexDivid[i], num[0].substr(0, num[0].length - 1) + "x^" + result);
        }
    }
    equation = duplicate;

    return equation;
}

function onesAndZeroes(equation) {
    equation = equation.replace("x^0", "");
    equation = equation.replace("+-", "-");
    equation = equation.replace(/0[-+]/g,"+");
    if (equation.charAt(0) === '+')
        equation = equation.substr(1, equation.length);

    return equation;
}

function m(equation) {
    equation = equation.replace("x+", "x^1+");
    equation = equation.replace("x-", "x^1-");
    if (equation.charAt(equation.length - 1) === 'x')
        equation = equation.substr(0, equation.length - 1) + "x^1";

    let variables = equation.match(/[-]?[0-9]+([.][0-9]+)?[x]?([\^][-]?[0-9]+([.][0-9]+)?)?/g);
    let nums = equation.match(/[-+][0-9]+([.][0-9]+)?[-+]/g);

    if (variables[0].match(/x/) == null) {
        let size = variables[0].length;
        equation = variables[0] + "x^0" + equation.substr(size, equation.length);
    }
    if (variables[variables.length - 1].match(/x/) == null && variables.length != 1) {
        equation = equation + "x^0";
    }
    if (nums != null) {
        for (let i = 0; i < nums.length; i++) {
            let n = nums[i].match(/[0-9]+([.][0-9]+)?/);
            equation = equation.replace(nums[i], nums[i].charAt(0) + n[0] + "x^0" + nums[i].charAt(nums[i].length - 1));
        }
    }

    return equation;
}

function derive(equation) {
    equation = m(equation);
    let variables = equation.match(/[-]?[0-9]+([.][0-9]+)?[x]?([\^][-]?[0-9]+([.][0-9]+)?)?/g);

    for (let i = 0; i < variables.length; i++) {
        let expos = variables[i].match(/[\^][-]?[0-9]+([.][0-9]+)?/g);
        let noExpo = variables[i].replace(/[\^][-]?[0-9]+([.][0-9]+)?/, "");
        let expoNum = expos[0].match(/[-]?[0-9]+([.][0-9]+)?/);
        let oldNum = noExpo.match(/[-]?[0-9]+([.][0-9]+)?/);
        let newExpo = parseFloat(expoNum[0]) - 1;
        let newNum = parseFloat(oldNum[0]) * parseFloat(expoNum[0]);
        let newVar = newNum + "x^" + newExpo;

        if (expoNum[0] !== "0")
            equation = equation.replace(variables[i], newVar);
        else
            equation = equation.replace(variables[i], 0);
    }
    //equation = addLikeTerms(equation);
    equation = onesAndZeroes(equation);
    equation = convertExponents(equation);

    return equation;
}

function addLikeTerms(equation) {
    let variables = equation.match(/[-]?[0-9]+([.][0-9]+)?[x]?([\^][-]?[0-9]+([.][0-9]+)?)?/g);
    let dup = "";
    for (let i = 0; i < variables.length; i++) {
        //Exponent
        let expos1 = variables[i].match(/[\^][-]?[0-9]+([.][0-9]+)?/g);
        //Variable without exponent
        let noExpo1 = variables[i].replace(/[\^][-]?[0-9]+([.][0-9]+)?/, "");
        //Exponent number
        let expoNum1 = expos1[0].match(/[-]?[0-9]+([.][0-9]+)?/);
        //Number behind
        let oldNum1 = noExpo1.match(/[-]?[0-9]+([.][0-9]+)?/);
        let result = parseFloat(oldNum1[0]);
        for (let j = 0; j < variables.length && i != j; j++) {
            let expos2 = variables[j].match(/[\^][-]?[0-9]+([.][0-9]+)?/g);
            //Variable without exponent
            let noExpo2 = variables[j].replace(/[\^][-]?[0-9]+([.][0-9]+)?/, "");
            //Exponent number
            let expoNum2 = expos2[0].match(/[-]?[0-9]+([.][0-9]+)?/);
            //Number behind
            let oldNum2 = noExpo2.match(/[-]?[0-9]+([.][0-9]+)?/);

            if (parseFloat(expoNum1[0]) === parseFloat(expoNum2[0])) {
                result += parseFloat(oldNum2[0]);
                equation = equation.replace(variables[j], "");
                variables.splice(j, 1);
            }
        }
        equation = equation.replace(variables[i], result + "x^" + expoNum1[0]);
    }

    return equation;
}

//I'll probably worked on this better simplification method later on code above is spaghetti
function newSimplify(equation) {
    /*if (equation.charAt(0) === 'x')
        equation = "1" + equation;
    equation = equation.replace(/[+]x/g,"+1x");
    equation = equation.replace(/[+]-x/g,"-1x");
    equation = equation.replace(/[/]x/g,"/1x");
    equation = equation.replace(/[*]x/g, "*1x");
    for (let i = 0; i < equation.length; i++) {
        if (equation.charAt(i) === "x" && i != equation.length - 1) {
            if (equation.charAt(i + 1) != "^")
                equation = equation.substr(0, i) + "^1" + equation.substr(i + 1, equation.length);
        }
        else if (i == equation.length - 1)
            equation = equation.substr(0, i) + "^1";
    }
    //Big Regex for the whole sub equation. Ex: 2x*2x^2/12x^3
    let bigRegex = equation.match(/([-]?[0-9]+([.][0-9]+)?)?[x]?([\^][-]?[0-9]+([.][0-9]+)?)?([/*]([-]?[0-9]+([.][0-9]+)?)?[x]?([\^][-]?[0-9]+([.][0-9]+)?)?)+/g);

    for (let i = 0; i < bigRegex.length; i++) {
        //Add every single number with a x^0, and xs with no exponent changed to x^1.
        let individuals = bigRegex[i].match(/[-]?[0-9]+([-]?[.][0-9]+)?(x([\^][-]?[0-9]+([-]?[.][0-9]+)?)?)?/g);
        for (let j = 0; j < individuals; j++) {
            if (individuals[j].match(/x/) == null)
                individuals[j] = individuals[j].replace(individuals[j], individuals[j] + "x^0");
            if (individuals[j].length === 2)
                individuals[j] = individuals[j].replace("x", "x^1");

        }

        //Small main regex to get 2 of the numbers from big regex. Ex: 2x*2x^2
        let mainRegex = bigRegex[i].match(/[-]?[0-9]+([-]?[.][0-9]+)?(x([\^][-]?[0-9]+([-]?[.][0-9]+)?)?)?[/*][-]?[0-9]+([-]?[.][0-9]+)?(x([\^][-]?[0-9]+([-]?[.][0-9]+)?)?)?/g);
        //Removes exponents from main regex
        let removeExpo = mainRegex[0].replace(/[\^][-]?[0-9]+([.][0-9]+)?/);
        let results = 1;
        let expo = 0;

        do {
            //Gets the numbers with the exponents removed
            var nums = removeExpo.match(/[-]?[0-9]+([-]?[.][0-9]+)?/);

            if (mainRegex[0].match(/[*]/g) != null) {
                results = parseFloat(nums[0]) * parseFloat(nums[1]);
            }
            else  if (mainRegex[0].match(/[/]/g) != null) {
                results = parseFloat(nums[0]) / parseFloat(nums[1]);
            }

            mainRegex[0].replace(mainRegex[0], results);

        } while (mainRegex != null);
    }*/
}
