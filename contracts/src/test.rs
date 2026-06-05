#![cfg(test)]

use super::*;
use soroban_sdk::{testutils::{Address as _}, Env};
use soroban_sdk::token::Client as TokenClient;
use soroban_sdk::token::StellarAssetClient;

#[test]
fn test_deposit_and_borrow() {
    let env = Env::default();
    env.mock_all_auths();

    // Setup user
    let user = Address::generate(&env);

    // Setup tokens
    let admin = Address::generate(&env);
    
    // Create USDC token
    let usdc_id = env.register_stellar_asset_contract_v2(admin.clone());
    let usdc = TokenClient::new(&env, &usdc_id.address());
    let usdc_admin = StellarAssetClient::new(&env, &usdc_id.address());
    
    // Create PHPT loan token
    let phpt_id = env.register_stellar_asset_contract_v2(admin.clone());
    let phpt = TokenClient::new(&env, &phpt_id.address());
    let phpt_admin = StellarAssetClient::new(&env, &phpt_id.address());

    // Mint some USDC to the user
    usdc_admin.mint(&user, &1000);

    // Deploy PadalaFi contract
    let contract_id = env.register_contract(None, PadalaFiContract);
    let client = PadalaFiContractClient::new(&env, &contract_id);
    
    // Mint PHPT to contract for lending pool
    phpt_admin.mint(&contract_id, &5000);

    // User deposits 1000 USDC
    client.deposit(&user, &usdc_id.address(), &1000);
    assert_eq!(client.get_collateral(&user), 1000);
    assert_eq!(usdc.balance(&user), 0);
    assert_eq!(usdc.balance(&contract_id), 1000);

    // User borrows 400 PHPT (max is 500)
    client.borrow(&user, &phpt_id.address(), &400);
    assert_eq!(client.get_borrowed(&user), 400);
    assert_eq!(phpt.balance(&user), 400);

    // User withdraws 200 USDC
    // Remaining collateral = 800. Max borrow = 400.
    client.withdraw(&user, &usdc_id.address(), &200);
    assert_eq!(client.get_collateral(&user), 800);
    assert_eq!(usdc.balance(&user), 200);
}
