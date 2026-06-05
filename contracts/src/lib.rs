#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, token};

#[contracttype]
pub enum DataKey {
    Collateral(Address), // USDC deposited
    Borrowed(Address),   // Tokens borrowed
}

#[contract]
pub struct PadalaFiContract;

#[contractimpl]
impl PadalaFiContract {
    /// Deposit collateral into the protocol
    pub fn deposit(env: Env, from: Address, token: Address, amount: i128) {
        from.require_auth();
        
        // Transfer tokens from user to contract
        let client = token::Client::new(&env, &token);
        client.transfer(&from, &env.current_contract_address(), &amount);
        
        // Update collateral balance
        let mut balance: i128 = env.storage().persistent().get(&DataKey::Collateral(from.clone())).unwrap_or(0);
        balance += amount;
        env.storage().persistent().set(&DataKey::Collateral(from), &balance);
    }

    /// Read the collateral balance of a user
    pub fn get_collateral(env: Env, user: Address) -> i128 {
        env.storage().persistent().get(&DataKey::Collateral(user)).unwrap_or(0)
    }

    /// Read the borrowed balance of a user
    pub fn get_borrowed(env: Env, user: Address) -> i128 {
        env.storage().persistent().get(&DataKey::Borrowed(user)).unwrap_or(0)
    }

    /// Borrow up to 50% of the collateral value. (Assuming 1:1 price ratio for MVP)
    pub fn borrow(env: Env, from: Address, loan_token: Address, amount: i128) {
        from.require_auth();
        
        let collateral: i128 = Self::get_collateral(env.clone(), from.clone());
        let borrowed: i128 = Self::get_borrowed(env.clone(), from.clone());
        
        // MVP logic: max borrow is 50% of collateral
        let max_borrow = collateral / 2;
        assert!(borrowed + amount <= max_borrow, "Insufficient collateral");
        
        // Update borrowed balance
        let new_borrowed = borrowed + amount;
        env.storage().persistent().set(&DataKey::Borrowed(from.clone()), &new_borrowed);
        
        // Transfer loan token to user
        let client = token::Client::new(&env, &loan_token);
        client.transfer(&env.current_contract_address(), &from, &amount);
    }
    
    /// Withdraw collateral, ensuring the loan remains healthy
    pub fn withdraw(env: Env, from: Address, token: Address, amount: i128) {
        from.require_auth();
        
        let collateral: i128 = Self::get_collateral(env.clone(), from.clone());
        let borrowed: i128 = Self::get_borrowed(env.clone(), from.clone());
        
        assert!(collateral >= amount, "Insufficient balance");
        
        // Ensure maintaining 200% collateral ratio
        let remaining = collateral - amount;
        assert!(borrowed <= remaining / 2, "Withdrawal would violate collateral ratio");
        
        // Update balance
        env.storage().persistent().set(&DataKey::Collateral(from.clone()), &remaining);
        
        // Transfer back to user
        let client = token::Client::new(&env, &token);
        client.transfer(&env.current_contract_address(), &from, &amount);
    }
}

#[cfg(test)]
mod test;
