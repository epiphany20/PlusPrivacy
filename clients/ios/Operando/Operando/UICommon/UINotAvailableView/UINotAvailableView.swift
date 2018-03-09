//
//  UINotAvailableView.swift
//  Operando
//
//  Created by Catalin Pomirleanu on 3/7/18.
//  Copyright © 2018 Operando. All rights reserved.
//

import UIKit

class UINotAvailableView: UIView {
    
    var whenLoginRequired: (() -> Void)?
    var whenNewAccountRequired: (() -> Void)?

    @IBOutlet var contentView: UIView!
    @IBOutlet weak var titleLabel: UILabel!
    @IBOutlet weak var loginButton: UIButton!
    @IBOutlet weak var createAccountButton: UIButton!
    
    @IBAction func didTapLoginButton(_ sender: Any) {
        whenLoginRequired?()
    }
    
    @IBAction func didTapCreateAccountButton(_ sender: Any) {
        whenNewAccountRequired?()
    }
    
    override init(frame: CGRect) {
        super.init(frame: frame)
        commonInit()
    }
    
    required init?(coder aDecoder: NSCoder) {
        super.init(coder: aDecoder)
        commonInit()
    }

    func setupWithCallbacks(whenLoginRequired: (() -> Void)?, whenNewAccountRequired: (() -> Void)?) {
        self.whenLoginRequired = whenLoginRequired
        self.whenNewAccountRequired = whenNewAccountRequired
    }
    
    func setupForUI(activeColor: UIColor?) {
        guard let activeColor = activeColor else { return }
        self.loginButton.backgroundColor = activeColor
        self.createAccountButton.setTitleColor(activeColor, for: .normal)
    }
}

private extension UINotAvailableView {
    
    func commonInit() {
        Bundle.main.loadNibNamed("UINotAvailableView", owner: self, options: nil)
        addSubview(contentView)
        contentView.frame = self.bounds
        contentView.autoresizingMask = [.flexibleHeight, .flexibleWidth]
    }
}
