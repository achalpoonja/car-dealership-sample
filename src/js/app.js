App = {
  web3Provider: null,
  contracts: {},
  account:'0x0',

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    // initializations
    if (typeof web3 !== 'undefined'){
      App.web3Provider=web3.currentProvider;
      web3=new Web3(web3.currentProvider);
    }
    else{
      App.web3Provider=new Web3.providers.HttpProvider('http://localhost:7545');
      web3=new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function() {
    $.getJSON("Dealer.json", function(dealer){
      App.contracts.Dealer=TruffleContract(dealer);
      App.contracts.Dealer.setProvider(App.web3Provider);
      return App.render();
    });
  },

  render: function() {
    var dealer_instance;

    web3.eth.getCoinbase(function (err, account){
      if(err == null){
        console.log(account);
        console.log(web3.eth.accounts);
        document.getElementById("accountAddress").innerHTML="Your account is: "+account;
      }
    });
  },
  addCar: function(){
    var dealer_instance;
    App.contracts.Dealer.deployed().then(function(instance){
      dealer_instance=instance;
      return dealer_instance.addCar(document.getElementById("car-reg").value);
    }).then(function(txn){
      if(txn.receipt.status=="0x1"){
      console.log("Car added successfully!");
      }
      else{
        console.log("failed");
      }
    });
  },
  searchCar: function(){
    var dealer_instance;
    App.contracts.Dealer.deployed().then(function(instance){
      dealer_instance=instance;
      return dealer_instance.getCar(document.getElementById("car-reg-query").value);
    }).then(function(out){
      document.getElementById("car-show").innerHTML="Searched vehicle details: <br> Registration: "+out[0]+"<br> Owner: "+out[1];
    });

  },
  transferOwner: function(){
    var dealer_instance;
    App.contracts.Dealer.deployed().then(function(instance){
      dealer_instance=instance;
      return dealer_instance.transfer_ownership_init(document.getElementById("car-reg-transfer").value,document.getElementById("new-owner").value);
    }).then(function(txn){
        if(txn.receipt.status="0x1"){
          alert("Ownership transferred successfully");
        }
        else{
          alert("Failed");
        }
      
    });
  },
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
