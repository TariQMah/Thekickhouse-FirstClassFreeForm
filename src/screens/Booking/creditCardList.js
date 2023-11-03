import React, { Component } from "react";

export default class CreditCardList extends Component {
  state = {
    isLoading: true,
  };

  componentDidMount() {}
  render() {
    let ccList = this.props.ccList;
    return (
      <div className="creditCardList row">
        <div className="payment-method-headline col-12">
          Your Credit/Debit Cards
        </div>
        <div className="col-12 small mb-3">
          Select the payment option of your choice, then click complete to
          finalize your booking.
        </div>
        {Object.keys(ccList).map((key) => {
          return (
            <div className="col-12 mb-1">
              <button
                className={
                  this.props.k_pay_bank === ccList[key].k_pay_bank
                    ? "btn btn-dark cc-btn btn-block"
                    : "btn btn-outline-dark cc-btn btn-block"
                }
                onClick={() => this.props.updateCreditCard(ccList[key])}
              >
                {ccList[key].text_name_card}
              </button>
            </div>
          );
        })}
        <div className="col-12 ">
          <button
            className="btn btn-link cc-new-link"
            onClick={() => this.props.visibleCreditCardForm()}
          >
            Add New Card
          </button>
        </div>
      </div>
    );
  }
}
