var Util = {};

Util.maintanens = {};

Util.maintanens.initValueOfSequanceGenerator = 1;

Util.maintanens.generateID = function() {
    return this.initValueOfSequanceGenerator++;
};
