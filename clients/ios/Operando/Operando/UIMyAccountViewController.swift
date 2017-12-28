//
//  UIMyAccountViewController.swift
//  Operando
//
//  Created by RomSoft on 12/21/17.
//  Copyright © 2017 Operando. All rights reserved.
//

import UIKit

struct UIMyAccountViewControllerOutlets {
    let tableView: UITableView?
    
    static let allNil: UIMyAccountViewControllerOutlets = UIMyAccountViewControllerOutlets(tableView: nil)
}

struct UIMyAccountViewControllerLogicCallbacks {
    
}

class UIMyAccountViewControllerLogic: NSObject, UITableViewDelegate, UITableViewDataSource,PasswordCellDelegate,PasswordExpandedCellDelegate {
    
    let outlets: UIMyAccountViewControllerOutlets
    let logicCallbacks: UIMyAccountViewControllerLogicCallbacks?
    private var changePassword = false
    
    init(outlets: UIMyAccountViewControllerOutlets, logicCallbacks: UIMyAccountViewControllerLogicCallbacks?) {
        self.outlets = outlets;
        self.logicCallbacks = logicCallbacks
        super.init()
        //        self.setupTableView()
    }
    
    func setupTableView(){
        //register cells
        self.outlets.tableView?.delegate = self
        self.outlets.tableView?.dataSource = self
        
        let nib = UINib(nibName: PasswordCell.identifierNibName, bundle: nil)
        self.outlets.tableView?.register(nib, forCellReuseIdentifier: PasswordCell.identifierNibName)
        
        let accountDeletionNib = UINib(nibName: AccountDeletionCell.identifierNibName, bundle: nil)
        self.outlets.tableView?.register(accountDeletionNib, forCellReuseIdentifier: AccountDeletionCell.identifierNibName)
        
        let passwordExpanedNib = UINib(nibName: PasswordExpandedCell.identifierNibName, bundle: nil)
        self.outlets.tableView?.register(passwordExpanedNib, forCellReuseIdentifier: PasswordExpandedCell.identifierNibName)
        
        //        self.outlets.tableView?.estimatedRowHeight = 70
        //        self.outlets.tableView?.rowHeight = UITableViewAutomaticDimension
    }
    // MARK: - TableView DataSource
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return 2
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        
        if indexPath.row == 0 {
            
            if changePassword == true {
                let cell = tableView.dequeueReusableCell(withIdentifier: PasswordExpandedCell.identifierNibName) as! PasswordExpandedCell
                cell.delegate = self
                return cell
            }
            else {
                let cell = tableView.dequeueReusableCell(withIdentifier: PasswordCell.identifierNibName) as! PasswordCell
                cell.delegate = self
                return cell
            }
        }
        else if indexPath.row == 1 {
            let cell = tableView.dequeueReusableCell(withIdentifier: AccountDeletionCell.identifierNibName) as! AccountDeletionCell
            return cell
        }
        
        return UITableViewCell()
    }
    
    func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        
        if indexPath.row == 0 {
            
            if changePassword == true {
                return 429
            }
            else {
                
                return 118
            }
            
        }
        
        return 230
        
    }
    
    // MARK: - ExpandedPasswordCellDelegate
    
    func pressedUpdatePassword() {
        self.changePassword = false
        let indexPath = IndexPath(row: 0, section: 0)
        self.outlets.tableView?.reloadData()
    }
    
    func pressedCancel() {
        self.changePassword = false
        let indexPath = IndexPath(row: 0, section: 0)
        self.outlets.tableView?.reloadData()
    }
    
    func newPasswordTFWereEdited(newPassword: String?, confirmPassword: String?, cell: PasswordExpandedCell) {
        
        var passwordStrenght = 0
        
        if newPassword != nil{
            
            if (newPassword?.count.toIntMax())! >= 6 {
                //                (numberOfStrenghtTypesIn(password: newPassword!) >= 1 && (newPassword?.count.toIntMax())! >= 8 ){
                
                passwordStrenght += 1
            }
            
            if passwordStrenght == 1 {
                
                passwordStrenght = numberOfStrenghtTypesIn(password: newPassword!)
                
                var multiples = (newPassword?.count)!/6 - 1
                
                if multiples == -1 {
                    multiples = 0
                }
                
                passwordStrenght = passwordStrenght + multiples
            }
            
            if passwordStrenght > 4 {
                passwordStrenght = 4
            }
        }
        
        cell.resetLevels(passwordStrenght: passwordStrenght)
    }
    
    // MARK: - Utilities
    
    private func numberOfStrenghtTypesIn(password: String) -> Int {
        
        var strenght = 0
        
        let sets = [CharacterSet.decimalDigits, CharacterSet.lowercaseLetters, CharacterSet.uppercaseLetters,CharacterSet.alphanumerics.inverted]
        
        for set in sets {
            
            if password.rangeOfCharacter(from: set) != nil {
                strenght = strenght+1
            }
        }
        
        return strenght
    }
    
    // MARK: - PasswordCellDelegate
    
    func pressedChangeButton() {
        
        self.changePassword = true
        let indexPath = IndexPath(row: 0, section: 0)
        self.outlets.tableView?.reloadData()
    }
    
}

class UIMyAccountViewController: UIViewController {
    
    @IBOutlet weak var tableView: UITableView!
    
    private(set) lazy var logic: UIMyAccountViewControllerLogic = {
        
        let outlets: UIMyAccountViewControllerOutlets = UIMyAccountViewControllerOutlets(tableView: self.tableView)
        let callBacks: UIMyAccountViewControllerLogicCallbacks = UIMyAccountViewControllerLogicCallbacks()
        
        return UIMyAccountViewControllerLogic(outlets: outlets, logicCallbacks: callBacks)
        
    }()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        logic.setupTableView()
    }
    
}
