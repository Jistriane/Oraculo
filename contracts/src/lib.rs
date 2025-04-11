#![no_std]

multiversx_sc::imports!();
multiversx_sc::derive_imports!();

use multiversx_sc::{
    api::ManagedTypeApi,
    types::{BigUint, ManagedAddress, ManagedBuffer, ManagedVec, MultiValueEncoded},
    storage::mappers::{SingleValueMapper, VecMapper},
};

#[derive(TopEncode, TopDecode, TypeAbi, NestedEncode, NestedDecode)]
pub struct Profile<M: ManagedTypeApi> {
    name: ManagedBuffer<M>,
    links: ManagedVec<M, ManagedBuffer<M>>,
    stars_received: BigUint<M>,
    stars_given: ManagedVec<M, ManagedAddress<M>>,
}

#[multiversx_sc::derive::contract]
pub trait StarChainIdentity {
    #[init]
    fn init(&self) {}

    #[endpoint]
    fn create_profile(
        &self,
        name: ManagedBuffer<Self::Api>,
        links: MultiValueEncoded<ManagedBuffer<Self::Api>>,
    ) {
        let caller = self.blockchain().get_caller();
        require!(
            !self.has_profile(&caller),
            "Profile already exists for this address"
        );

        let profile = Profile {
            name,
            links: links.to_vec(),
            stars_received: BigUint::zero(),
            stars_given: ManagedVec::new(),
        };

        self.profiles(&caller).set(profile);
        self.profile_addresses().push(&caller);
    }

    #[endpoint]
    #[payable("EGLD")]
    fn give_star(&self, to: ManagedAddress<Self::Api>) {
        let caller = self.blockchain().get_caller();
        require!(
            self.has_profile(&caller),
            "Caller must have a profile to give stars"
        );
        require!(
            self.has_profile(&to),
            "Recipient must have a profile to receive stars"
        );
        require!(caller != to, "Cannot give stars to yourself");
        require!(
            !self.has_given_star(&caller, &to),
            "Already given a star to this profile"
        );

        let payment = self.call_value().egld_value();
        require!(
            payment == self.star_price().get(),
            "Must pay exactly the star price"
        );

        let mut profile = self.profiles(&to).get();
        profile.stars_received += 1u32;
        self.profiles(&to).set(profile);

        let mut caller_profile = self.profiles(&caller).get();
        caller_profile.stars_given.push(&to);
        self.profiles(&caller).set(caller_profile);
    }

    #[view(getProfile)]
    fn get_profile(&self, address: ManagedAddress<Self::Api>) -> Profile<Self::Api> {
        require!(
            self.has_profile(&address),
            "Profile does not exist for this address"
        );
        self.profiles(&address).get()
    }

    #[view(getTopProfiles)]
    fn get_top_profiles(&self, limit: usize) -> MultiValueEncoded<Profile<Self::Api>> {
        let mut profiles = Vec::new();
        for address in self.profile_addresses().iter() {
            profiles.push(self.profiles(&address).get());
        }

        profiles.sort_by(|a, b| b.stars_received.cmp(&a.stars_received));
        profiles
            .into_iter()
            .take(limit)
            .collect::<MultiValueEncoded<_>>()
    }

    // Storage

    #[view(hasProfile)]
    fn has_profile(&self, address: &ManagedAddress<Self::Api>) -> bool {
        !self.profiles(address).is_empty()
    }

    #[view(hasGivenStar)]
    fn has_given_star(
        &self,
        from: &ManagedAddress<Self::Api>,
        to: &ManagedAddress<Self::Api>,
    ) -> bool {
        let profile = self.profiles(from).get();
        profile.stars_given.contains(to)
    }

    #[storage_mapper("profiles")]
    fn profiles(&self, address: &ManagedAddress<Self::Api>) -> SingleValueMapper<Profile<Self::Api>>;

    #[storage_mapper("profileAddresses")]
    fn profile_addresses(&self) -> VecMapper<ManagedAddress<Self::Api>>;

    #[storage_mapper("starPrice")]
    fn star_price(&self) -> SingleValueMapper<BigUint<Self::Api>>;
} 