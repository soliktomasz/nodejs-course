const utils = require('./utils');
const expect = require('expect');

describe('Utils', () => {
    it('Should add two numbers', () => {
        var res = utils.add(5, 4);
    
        expect(res).toBe(9).toBeA('number');
        // if (res !== 9) {
        //     throw new Error(`Expected 9, but got ${res}`);
        // }
    });
    
    it('Should async add two numbers', (done) => {
        utils.addAsync(4, 4, (sum) => {
            expect(sum).toBe(8).toBeA('number');
            done();
        });
    });
    
    it('Should square a number', () => {
        var res = utils.square(5);
    
        expect(res).toBe(25).toBeA('number');
    });
    
    it('Should square async a number', (done) => {
        utils.squareAsync(5, (sum) => {
            expect(sum).toBe(25).toBeA('number');
            done();
        });
    });
    
});


it('Should verify first and last name are set', () => {
    var user = {
        location: 'Poznan',
        age: '27'
    };
    var res = utils.setName(user, 'Tomasz Solik')
    expect(res).toInclude({
        firstName: 'Tomasz',
        lastName: 'Solik'
    });
});