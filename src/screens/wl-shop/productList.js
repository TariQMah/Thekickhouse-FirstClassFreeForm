import React, { Component } from "react";
export default class ProductList extends Component {
  render() {
    const productList = this.props.wpLocationData.as_franchiseProducts;
    return (
      <div className="col-12">
        {!productList && (
          <div> No active offers available for this Location</div>
        )}
        {productList && (
          <div>
            <div className="section-heading h3">
              Select from Available Purchase Options:
            </div>
            {productList.map((p) => {
              return (
                <button
                  className={
                    this.props.selectedPurchaseOption.as_franchiseProductId ===
                    p.as_franchiseProductId
                      ? "btn btn-block btn-dark p-option"
                      : "btn btn-block btn-outline-dark p-option"
                  }
                  onClick={() => this.props.updatePurchaseOption(p)}
                >
                  <div className="d-sm-block">
                    {" "}
                    {"$"} {p.as_franchiseProductPrice}
                    {" | "}
                    {p.as_franchiseProductName}
                    {" | "}
                    {p.as_franchiseProductValidity}
                  </div>
                </button>
              );
            })}
          </div>
        )}
        <div className="col-12 navigationButtons">
          <div className="row">
            <div className="col-6">
              <button
                className="btn btn-outline-dark back-step-btn btn-block"
                onClick={() => this.props.updateScreen(1)}
              >
                Back A Step
              </button>
            </div>
            <div className="col-6">
              <button
                className="btn btn-outline-dark next-btn btn-block"
                onClick={() => this.props.updateBookingStep(2)}
                disabled={this.props.selectedPurchaseOption ? false : true}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
