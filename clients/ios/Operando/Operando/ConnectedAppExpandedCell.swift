//
//  ConnectedAppExpandedCell.swift
//  Operando
//
//  Created by RomSoft on 4/12/18.
//  Copyright © 2018 Operando. All rights reserved.
//

import UIKit

protocol ConnectedAppExpandedCellDelegate {
    func unistallApp(appID: String)
}

class ConnectedAppExpandedCell: UITableViewCell {

    @IBOutlet weak var expandedCellDescription: UILabel!
    @IBOutlet weak var expandedCellTitle: UILabel!
    static let identifier = "ConnectedAppExpandedCell"
    private var permissions: [String]? = []
    private var callbacks: UIConnectedTableViewControllerCallbacks?
    private var appId: String?
    @IBOutlet weak var appImageView: UIImageView!
    @IBOutlet weak var viewPermissionsView: UIView!
    @IBOutlet weak var colorView: UIView!
    
    @IBOutlet weak var unistallButtonView: UIView!
    @IBOutlet weak var viewPermissionsButtonView: UIView!
    
    var delegate:ConnectedAppExpandedCellDelegate?
    
    override func awakeFromNib() {
        super.awakeFromNib()
        // Initialization code
        self.setupColorView()
        self.selectionStyle = .none
        self.appImageView.image = #imageLiteral(resourceName: "connected-apps-mob")
    }
    
    private func setupColorView(){
        colorView.layer.cornerRadius = colorView.frame.height/2
        colorView.layer.borderWidth = 1
        colorView.layer.borderColor = UIColor.white.cgColor
    }
    
    // MARK: - Actions
    
    @IBAction func pressedUnistallButton(_ sender: Any) {
        
        if let appId = self.appId {
            
            delegate?.unistallApp(appID: appId)
        }
    }
    
    @IBAction func pressedViewPermissionsButton(_ sender: Any) {
        if let permissions = self.permissions {
            callbacks?.showPermissions?(permissions)
        }
    }
    // MARK: - Setups and Utils
   
    func setupWith(app: ConnectedApp,callbacks: UIConnectedTableViewControllerCallbacks){
        self.expandedCellTitle.text = app.name
        self.expandedCellDescription.text = ""
        self.permissions = app.permissions
        self.appId = app.appId
        self.callbacks = callbacks
        
        if self.permissions == nil ||
            self.permissions?.count == 0{
            viewPermissionsView.isHidden = true
        }
        else {
            viewPermissionsView.isHidden = false
        }
        
        if let appIconURL = app.iconURL
        {
            var modifiedURL1 = appIconURL.replace(target: "\\", withString: "%");
            modifiedURL1 = modifiedURL1.replace(target: " ", withString: "");
            modifiedURL1 = modifiedURL1.decodeUrl()
            if modifiedURL1.contains(find: ".svg") == true {
            }
            else if let url = URL(string: modifiedURL1){
                
                self.appImageView?.setImageWith(url)
            }
        }
        
        if app.permissions.count != 0 {
            let score = ACPoluttionManager.shared.calculatePollution(permissions: app.permissions)
            self.expandedCellDescription.text = "Privacy Pollution: \(score)/10"
            self.colorView.backgroundColor =  ACPoluttionManager.shared.getColorForPermissionsScore(score: score)
        }
        else {
            self.colorView.isHidden = true
        }
        
        setupMainViewBackgroundColor()  
    }
    
    private func setupMainViewBackgroundColor() {
        switch ACPrivacyWizard.shared.selectedScope {
        case .facebook:
            unistallButtonView.backgroundColor = UIColor.fbPrivacyTopBar
            viewPermissionsView.backgroundColor = UIColor.fbPrivacyTopBar
            break
        case .linkedIn:
            unistallButtonView.backgroundColor = UIColor.lkPrivacyTopBar
            viewPermissionsView.backgroundColor = UIColor.lkPrivacyTopBar
            break
        case .twitter:
            unistallButtonView.backgroundColor = UIColor.twPrivacyTopBar
            viewPermissionsView.backgroundColor = UIColor.twPrivacyTopBar
            break
        case .googleLogin:
            unistallButtonView.backgroundColor = UIColor.goPrivacyTopBar
            viewPermissionsView.backgroundColor = UIColor.goPrivacyTopBar
            break
        default:
            break
        }
    }
    
}