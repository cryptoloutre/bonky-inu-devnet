use {
    anchor_lang::{
        prelude::*,
        solana_program::program::{invoke,invoke_signed,},
        system_program,
    },
    anchor_spl::{
        associated_token::{self, AssociatedToken},
        token::{self, Mint, Token, TokenAccount, Transfer, MintTo},
    },
    mpl_token_metadata::{
        ID as TOKEN_METADATA_ID,
        instruction as token_instruction,
    },
    std::str::FromStr,
};

declare_id!("HMvhKYe2diFwk8NgtZPvPWTTFBZq9UyLw6876J3L8Edh");

#[program]
pub mod bonky_inu {
    use super::*;

    pub fn initialize_vault(
        ctx: Context<InitializeVault>,
    ) -> Result<()> {

        let vault = &mut ctx.accounts.vault;
        vault.withdrawer = ctx.accounts.initializer.key();
        vault.bump = *ctx.bumps.get("vault").unwrap();

        Ok(())
    }

    pub fn initialize_update_authority(
        _ctx: Context<InitializeUpdateAuthority>,
    ) -> Result<()> {

        Ok(())
    }

    pub fn initialize_state_pda(
        ctx: Context<InitializeStatePDA>,
    ) -> Result<()> {

        let statepda = &mut ctx.accounts.statepda;
        statepda.bump = *ctx.bumps.get("statepda").unwrap();
        statepda.amount = 0;

        Ok(())
    }

    pub fn initialize_bonk_vault(
        _ctx: Context<InitializeBonkVault>,
    ) -> Result<()> {

        Ok(())
    }

    pub fn initialize_burn_counter(
        ctx: Context<InitializeBurnCounter>,
    ) -> Result<()> {

        let burncounter = &mut ctx.accounts.burncounter;
        burncounter.bump = *ctx.bumps.get("burncounter").unwrap();
        burncounter.counter = 0;
        Ok(())
    }

        pub fn initialize_player(
        ctx: Context<InitializePlayer>,
    ) -> Result<()> {

        let player = &mut ctx.accounts.player;
        player.game_played = 0;
        player.highscore = 0;
        player.owner = ctx.accounts.owner.key();
        player.bump = *ctx.bumps.get("player").unwrap();
        player.a1_is_unlocked = false;
        player.a2_is_unlocked = false;
        player.a3_is_unlocked = false;
        player.a4_is_unlocked = false;
        player.a5_is_unlocked = false;
        player.a6_is_unlocked = false;
        player.a7_is_unlocked = false;
        player.a8_is_unlocked = false;
        player.a9_is_unlocked = false;
        player.a10_is_unlocked = false;
        player.a11_is_unlocked = false;
        player.a12_is_unlocked = false;

        Ok(())
    }

    pub fn new_game(
        ctx: Context<NewGame>,
    ) -> Result<()> {

        let player = &mut ctx.accounts.player;
        player.game_played += 1;

        //uncomment when pushed on mainnet

        // token::transfer(
        //     CpiContext::new(
        //         ctx.accounts.token_program.to_account_info(),
        //         Transfer {
        //             from: ctx.accounts.owner_token_account.to_account_info(),
        //             to: ctx.accounts.tokenpda.to_account_info(),
        //             authority: ctx.accounts.owner.to_account_info(),
        //         }
        //     ),
        //     9000000000
        // )?;

        let statepda = &mut ctx.accounts.statepda;
        statepda.amount += 9000000000;

        //uncomment when pushed on mainnet

        // token::burn(
        //     CpiContext::new(
        //         ctx.accounts.token_program.to_account_info(),
        //         token::Burn {
        //             mint: ctx.accounts.mint.to_account_info(),
        //             from: ctx.accounts.owner_token_account.to_account_info(),
        //             authority: ctx.accounts.owner.to_account_info(),
        //         }
        //     ),
        //     1000000000
        // )?;

        let burncounter = &mut ctx.accounts.burncounter;
        burncounter.counter += 1000000; //1000000000

        emit!(NewGamePlayed {
            game_played: player.game_played,
        });

        Ok(())
    }

    pub fn new_highscore(
        ctx: Context<NewHighscore>,
        new_highscore: u16,
    ) -> Result<()> {

        let player = &mut ctx.accounts.player;
        player.highscore = new_highscore;

        emit!(NewHighscoreSet {
            highscore: player.highscore,
        });

        Ok(())
    }

    pub fn unlock_achievement(
        ctx: Context<UnlockAchievement>,
        achievement: String,
    ) -> Result<()> {

    // Calculate the rent
    let rent = Rent::get()?;
    // We know the size of a mint account is 82
    let rent_lamports = rent.minimum_balance(82);
        let player = &mut ctx.accounts.player;
        let mut title: String = String::from("");
        let mut uri: String = String::from("");

        if achievement == String::from("welcome") {
            if player.game_played == 0 {
                return Err(error!(ErrorCode::InvalidNumberGame));
            }
            else {
                msg!("unlock welcome achievement");
                title = String::from("Welcome To The Bonkers!");
                uri  = String::from("https://arweave.net/F8FM1AZszG55xkpdiLJ_wF6kDAZGhXoeYhouiuIUJII");
                player.a1_is_unlocked = true;
            }
        }
        
        if achievement == String::from("casual") {
            if player.game_played < 5 {
                return Err(error!(ErrorCode::InvalidNumberGame));
            }
            else {
                msg!("unlock casual achievement");
                title = String::from("Casual Player");
                uri  = String::from("https://arweave.net/6K2FUsevo0WaOTRKlK3RwsVAjRFZzmjRQ5sN7wU7jHg");
                player.a2_is_unlocked = true;
            }
        }

        if achievement == String::from("regular") {
            if player.game_played < 25 {
                return Err(error!(ErrorCode::InvalidNumberGame));
            }
            else {
                msg!("unlock regular achievement");
                title = String::from("Regular Player");
                uri  = String::from("https://arweave.net/djxqCUsxwTQcBXBZm9JG_PlSKTeu9eyaEgEyrxkrZUE");
                player.a3_is_unlocked = true;
            }
        }

        if achievement == String::from("hardcore") {
            if player.game_played < 50 {
                return Err(error!(ErrorCode::InvalidNumberGame));
            }
            else {
                msg!("unlock hardcore achievement");
                title = String::from("Hardcore Player");
                uri  = String::from("https://arweave.net/Bh-ZattHAhOZc5ARK8xSH3uNGbCK28pNqrpytgnhw1w");
                player.a4_is_unlocked = true;
            }
        }

        if achievement == String::from("addict") {
            if player.game_played < 100 {
                return Err(error!(ErrorCode::InvalidNumberGame));
            }
            else {
                msg!("unlock addict achievement");
                title = String::from("Addict Player");
                uri  = String::from("https://arweave.net/xgOhKiBtrFKww-Dz9zTan8dkTnqV1zmElAgAS0Al1ek");
                player.a5_is_unlocked = true;
            }
        }

        if achievement == String::from("comeon") {
            if player.game_played < 500 {
                return Err(error!(ErrorCode::InvalidNumberGame));
            }
            else {
                msg!("unlock come on achievement");
                title = String::from("Come on, man!");
                uri  = String::from("https://arweave.net/rmQhJW-ddFEf1p6xT-x33hjv3VUothmcrE66GVRczFg");
                player.a6_is_unlocked = true;
            }
        }

        if achievement == String::from("aspiring") {
            if player.highscore == 0 {
                return Err(error!(ErrorCode::InvalidHighscore));
            }
            else {
                msg!("unlock aspiring achievement");
                title = String::from("Aspiring Bonker");
                uri  = String::from("https://arweave.net/UIQJGBV-0P0w1av8a3LCWy4LHdPFLWIpXvlTMubwJn0");
                player.a7_is_unlocked = true;
            }
        }

        if achievement == String::from("pro") {
            if player.highscore < 50 {
                return Err(error!(ErrorCode::InvalidHighscore));
            }
            else {
                msg!("unlock pro achievement");
                title = String::from("Pro Bonker");
                uri  = String::from("https://arweave.net/UXn2bOjCzT56zFrcyREPNdUQiUyBehvYaNnZhM-h5WU");
                player.a8_is_unlocked = true;
            }
        }

        if achievement == String::from("elite") {
            if player.highscore < 100 {
                return Err(error!(ErrorCode::InvalidHighscore));
            }
            else {
                msg!("unlock elite achievement");
                title = String::from("Elite Bonker");
                uri  = String::from("https://arweave.net/rlcL6Qq43Om4VrK4VUOxCx-6A4yaNy9OOt-OSV9IDR8");
                player.a9_is_unlocked = true;
            }
        }

        if achievement == String::from("legendary") {
            if player.highscore < 150 {
                return Err(error!(ErrorCode::InvalidHighscore));
            }
            else {
                msg!("unlock legendary achievement");
                title = String::from("Legendary Bonker");
                uri  = String::from("https://arweave.net/FXwMB6u89vhkgsBpEdfBn79HbIzMV1LsYsnBnFoPRl4");
                player.a10_is_unlocked = true;
            }
        }

        if achievement == String::from("holy") {
            if player.highscore < 200 {
                return Err(error!(ErrorCode::InvalidHighscore));
            }
            else {
                msg!("unlock holy achievement");
                title = String::from("Holy Bonker");
                uri  = String::from("https://arweave.net/dZDJb_Zo_zi1RlyXqGAdB8f8e3QmngB5KysmsSKMsGQ");
                player.a11_is_unlocked = true;
            }
        }

        if achievement == String::from("master") {
            if player.a1_is_unlocked == true &&
            player.a2_is_unlocked == true &&
            player.a3_is_unlocked == true &&
            player.a4_is_unlocked == true &&
            player.a5_is_unlocked == true &&
            player.a6_is_unlocked == true &&
            player.a7_is_unlocked == true &&
            player.a8_is_unlocked == true &&
            player.a9_is_unlocked == true &&
            player.a10_is_unlocked == true &&
            player.a11_is_unlocked == true
             {
                msg!("unlock master achievement");
                title = String::from("The Bonk Master");
                uri  = String::from("https://arweave.net/niQqBKy9dz-5kigKHuKrG88vLcNSSsOt2W2wWGfQou0");
                player.a12_is_unlocked = true;
            }
            else {
                return Err(error!(ErrorCode::InvalidUnlocked));
            }
        }

        system_program::create_account(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                system_program::CreateAccount {
                    from: ctx.accounts.owner.to_account_info(),
                    to: ctx.accounts.mint.to_account_info(),
                },
            ),
            rent_lamports,
            82,
            &ctx.accounts.token_program.key(),
        )?;

        token::initialize_mint(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                token::InitializeMint {
                    mint: ctx.accounts.mint.to_account_info(),
                    rent: ctx.accounts.rent.to_account_info(),
                },
            ),
            0,
            &ctx.accounts.owner.key(),
            Some(&ctx.accounts.owner.key()),
        )?;
 
        associated_token::create(
            CpiContext::new(
                ctx.accounts.associated_token_program.to_account_info(),
                associated_token::Create {
                    payer: ctx.accounts.owner.to_account_info(),
                    associated_token: ctx.accounts.token_account.to_account_info(),
                    authority: ctx.accounts.owner.to_account_info(),
                    mint: ctx.accounts.mint.to_account_info(),
                    system_program: ctx.accounts.system_program.to_account_info(),
                    token_program: ctx.accounts.token_program.to_account_info(),
                    rent: ctx.accounts.rent.to_account_info(),
                },
            ),
        )?;

        token::mint_to(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                MintTo {
                    mint: ctx.accounts.mint.to_account_info(),
                    to: ctx.accounts.token_account.to_account_info(),
                    authority: ctx.accounts.owner.to_account_info(),
                },
            ),
            1,
        )?;
        let creator = vec![
            mpl_token_metadata::state::Creator {
                address: ctx.accounts.vault.key(),
                verified: false,
                share: 100,
            }
        ];

        let collection_address = Pubkey::from_str("9WEzxC5SYzce9cPMqVvxcjR8kgkkKYQYQar31y35w7TF").unwrap();
        let collection = mpl_token_metadata::state::Collection {
                verified: false,
                key: collection_address,
            };

        invoke(
            &token_instruction::create_metadata_accounts_v3(
                TOKEN_METADATA_ID, 
                ctx.accounts.metadata.key(), 
                ctx.accounts.mint.key(), 
                ctx.accounts.owner.key(), 
                ctx.accounts.owner.key(), 
                ctx.accounts.update_authority.key(), 
                title, 
                String::from("BONKY"), 
                uri, 
                Some(creator),
                100,
                false, 
                true, 
                Some(collection), 
                None,
                None,
            ),
            &[
                ctx.accounts.metadata.to_account_info(),
                ctx.accounts.mint.to_account_info(),
                ctx.accounts.token_account.to_account_info(),
                ctx.accounts.owner.to_account_info(),
                ctx.accounts.update_authority.to_account_info(), 
                ctx.accounts.rent.to_account_info(),
            ],
        )?;

        let seeds = &["update_authority".as_bytes(), &[*ctx.bumps.get("update_authority").unwrap()]];

        let signer = [&seeds[..]];

        invoke_signed(
            &token_instruction::create_master_edition_v3(
                TOKEN_METADATA_ID, 
                ctx.accounts.master_edition.key(), 
                ctx.accounts.mint.key(), 
                ctx.accounts.update_authority.key(), 
                ctx.accounts.owner.key(), 
                ctx.accounts.metadata.key(), 
                ctx.accounts.owner.key(), 
                Some(0),
            ),
            &[
                ctx.accounts.master_edition.to_account_info(),
                ctx.accounts.metadata.to_account_info(),
                ctx.accounts.mint.to_account_info(),
                ctx.accounts.token_account.to_account_info(),
                ctx.accounts.update_authority.to_account_info(), 
                ctx.accounts.owner.to_account_info(),
                ctx.accounts.rent.to_account_info(),
            ],
            &signer,
        )?;

        let ix = anchor_lang::solana_program::system_instruction::transfer(
            &ctx.accounts.owner.key(),
            &ctx.accounts.vault.key(),
            1018800,
        );
        anchor_lang::solana_program::program::invoke(
            &ix,
            &[
                ctx.accounts.owner.to_account_info(),
                ctx.accounts.vault.to_account_info(),
            ],
        )?;
        
        emit!(AchievementUnlocked {
            a1_is_unlocked: player.a1_is_unlocked,
            a2_is_unlocked: player.a2_is_unlocked,
            a3_is_unlocked: player.a3_is_unlocked,
            a4_is_unlocked: player.a4_is_unlocked,
            a5_is_unlocked: player.a5_is_unlocked,
            a6_is_unlocked: player.a6_is_unlocked,
            a7_is_unlocked: player.a7_is_unlocked,
            a8_is_unlocked: player.a8_is_unlocked,
            a9_is_unlocked: player.a9_is_unlocked,
            a10_is_unlocked: player.a10_is_unlocked,
            a11_is_unlocked: player.a11_is_unlocked,
            a12_is_unlocked: player.a12_is_unlocked,
        });

        Ok(())
    }

    pub fn withdraw_vault(
        ctx: Context<WithdrawVault>,
        amount_of_lamports: u64,
    ) -> Result<()> {

        let vault = &ctx.accounts.vault;
        let withdrawer = &ctx.accounts.withdrawer;

        **withdrawer.to_account_info().try_borrow_mut_lamports()? += amount_of_lamports;
        **vault.to_account_info().try_borrow_mut_lamports()? -= amount_of_lamports;

        Ok(())
    }
    
    pub fn withdraw_bonk_vault(
        ctx: Context<WithdrawBonkVault>,
        amount: u64,
    ) -> Result<()> {

        let seeds = &["statepda".as_bytes(), &[*ctx.bumps.get("statepda").unwrap()]];

        let signer = [&seeds[..]];

        token::transfer(
            CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.tokenpda.to_account_info(),
                    to: ctx.accounts.user_token_account.to_account_info(),
                    authority: ctx.accounts.statepda.to_account_info(),
                },
                &signer,
            ),
            amount
        )?;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeVault<'info> {
    #[account(
        init,
        payer = initializer,
        space = Vault::LEN,
        seeds = [b"vault".as_ref()],
        bump
    )]
    pub vault: Account<'info, Vault>,
    #[account(mut)]
    pub initializer: Signer<'info>,
    pub system_program: Program<'info, System>,
}


#[derive(Accounts)]
pub struct InitializeUpdateAuthority<'info> {
    #[account(
        init,
        payer = initializer,
        space = Vault::LEN,
        seeds = [b"update_authority".as_ref()],
        bump
    )]
    /// CHECK: manual check
    pub update_authority: UncheckedAccount<'info>,
    #[account(mut)]
    pub initializer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct InitializeStatePDA<'info> {
    #[account(
        init,
        payer = initializer,
        space = State::LEN,
        seeds = [b"statepda".as_ref()],
        bump
    )]
    statepda: Account<'info, State>,
    #[account(mut)]
    pub initializer: Signer<'info>,
    pub system_program: Program<'info,System>,
}

#[derive(Accounts)]
pub struct InitializeBonkVault<'info> {
    #[account(
        init,
        payer = owner,
        seeds = [b"bonkVault".as_ref()],
        bump,
        token::mint = mint,
        token::authority = statepda,
     )]
     
     pub tokenpda: Account<'info, TokenAccount>,
    #[account(
        seeds = [b"statepda".as_ref()],
        bump = statepda.bump
    )]
    pub statepda: Account<'info,State>,
    pub mint: Account<'info, Mint>,
    #[account(mut)]
    pub owner: Signer<'info>,
    pub system_program: Program<'info,System>,
    pub rent: Sysvar<'info, Rent>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct InitializeBurnCounter<'info> {
    #[account(
        init,
        payer = initializer,
        space = BurnCounter::LEN,
        seeds = [b"burn_counter".as_ref()],
        bump
    )]
    burncounter: Account<'info, BurnCounter>,
    #[account(mut)]
    pub initializer: Signer<'info>,
    pub system_program: Program<'info,System>,
}

#[derive(Accounts)]
pub struct InitializePlayer<'info> {
    #[account(
        init,
        payer = owner,
        space = Player::LEN,
        seeds = [b"player".as_ref(), b"season1".as_ref(), owner.key().as_ref()],
        bump
    )]
    pub player: Account<'info, Player>,
    #[account(mut)]
    pub owner: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct NewGame<'info> {
    #[account(
        mut,
        seeds = [b"player".as_ref(), b"season1".as_ref(), owner.key().as_ref()],
        bump = player.bump
    )]
    pub player: Account<'info, Player>,
    #[account(
        mut,
        seeds = [b"bonkVault".as_ref()],
        bump
     )]
     
    pub tokenpda: Account<'info, TokenAccount>,
    #[account(
        mut,
        seeds = [b"statepda".as_ref()],
        bump = statepda.bump
    )]
    statepda: Account<'info, State>,
    #[account(mut)]
    pub owner: Signer<'info>,
    // uncomment when pushed on mainnet
    // #[account(
    //     mut,
    //     constraint=owner_token_account.owner == owner.key(),
    //     constraint=owner_token_account.mint == tokenpda.mint
    // )]
    // pub owner_token_account: Account<'info, TokenAccount>,
    #[account(
        mut,
        constraint=mint.key() == tokenpda.mint,
    )]
    pub mint: Account<'info, Mint>,
    #[account(
        mut,
        seeds = [b"burn_counter".as_ref()],
        bump = burncounter.bump
    )]
    burncounter: Account<'info, BurnCounter>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct NewHighscore<'info> {
    #[account(
        mut,
        seeds = [b"player".as_ref(), b"season1".as_ref(), owner.key().as_ref()],
        bump = player.bump
    )]
    pub player: Account<'info, Player>,
    #[account(mut)]
    pub owner: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UnlockAchievement<'info> {
    #[account(
        mut,
        seeds = [b"player".as_ref(), b"season1".as_ref(), owner.key().as_ref()],
        bump = player.bump
    )]
    pub player: Account<'info, Player>,
    #[account(mut)]
    /// CHECK: We're about to create this with Metaplex
    pub metadata: UncheckedAccount<'info>,
    /// CHECK: We're about to create this with Metaplex
    #[account(mut)]
    pub master_edition: UncheckedAccount<'info>,
    #[account(mut)]
    pub mint: Signer<'info>,
    /// CHECK: We're about to create this with Anchor
    #[account(mut)]
    pub token_account: UncheckedAccount<'info>,
    pub owner: Signer<'info>,
    #[account(
        mut,
        seeds = [b"vault".as_ref()],
        bump = vault.bump,
    )]
    pub vault: Account<'info, Vault>,
    #[account(
        mut,
        seeds = [b"update_authority".as_ref()],
        bump
    )]
    /// CHECK: manual check
    pub update_authority: UncheckedAccount<'info>,
    pub rent: Sysvar<'info, Rent>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    /// CHECK: Metaplex will check this
    pub token_metadata_program: UncheckedAccount<'info>,
}

#[derive(Accounts)]
pub struct WithdrawVault<'info> {
    #[account(mut)]
    pub withdrawer: Signer<'info>,
    #[account(
        mut,
        seeds = [b"vault".as_ref()],
        bump = vault.bump,
        has_one = withdrawer
    )]
    pub vault: Account<'info, Vault>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct WithdrawBonkVault<'info> {
    #[account(mut)]
    pub withdrawer: Signer<'info>,
    #[account(
        seeds = [b"vault".as_ref()],
        bump = vault.bump,
        has_one = withdrawer
    )]
    pub vault: Account<'info, Vault>,
    #[account(
        mut,
        seeds = [b"bonkVault".as_ref()],
        bump
     )]
    pub tokenpda: Account<'info, TokenAccount>,
    #[account(
        mut,
        seeds = [b"statepda".as_ref()],
        bump = statepda.bump
    )]
    statepda: Account<'info, State>,
    #[account(
        mut,
        constraint=user_token_account.mint == tokenpda.mint
    )]
    pub user_token_account: Account<'info, TokenAccount>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
}

#[account]
pub struct Player {
    pub game_played: u16,
    pub highscore: u16,
    pub owner: Pubkey,
    pub bump: u8,
    pub a1_is_unlocked: bool,
    pub a2_is_unlocked: bool,
    pub a3_is_unlocked: bool,
    pub a4_is_unlocked: bool,
    pub a5_is_unlocked: bool,
    pub a6_is_unlocked: bool,
    pub a7_is_unlocked: bool,
    pub a8_is_unlocked: bool,
    pub a9_is_unlocked: bool,
    pub a10_is_unlocked: bool,
    pub a11_is_unlocked: bool,
    pub a12_is_unlocked: bool,
}

const DISCRIMINATOR_LENGTH: usize = 8;
const BUMP_LENGTH: usize = 1;
const HIGHSCORE_LENGTH: usize = 2;
const GAME_PLAYED_LENGTH: usize = 2;
const ACHIEVEMENT_LENGTH: usize = 1;
const AMOUNT_LENGTH: usize = 8;
const COUNTER_LENGTH: usize = 8;

impl Player {
    const LEN: usize = DISCRIMINATOR_LENGTH + GAME_PLAYED_LENGTH + HIGHSCORE_LENGTH + 32 + BUMP_LENGTH + (12 * ACHIEVEMENT_LENGTH);
}

#[account]
pub struct Vault {
    pub withdrawer: Pubkey,
    pub bump: u8,
}

impl Vault {
    const LEN: usize = DISCRIMINATOR_LENGTH + 32 + BUMP_LENGTH;
}

#[account]
pub struct State {
    pub bump: u8,
    pub amount: u64,
}

impl State {
    const LEN: usize = DISCRIMINATOR_LENGTH + BUMP_LENGTH + AMOUNT_LENGTH;
}

#[account]
pub struct BurnCounter {
    pub bump: u8,
    pub counter: u64,
}

impl BurnCounter {
    const LEN: usize = DISCRIMINATOR_LENGTH + BUMP_LENGTH + COUNTER_LENGTH;
}

#[event]
pub struct NewGamePlayed {
    pub game_played: u16,
}

#[event]
pub struct NewHighscoreSet {
    pub highscore: u16,
}

#[event]
pub struct AchievementUnlocked {
    pub a1_is_unlocked: bool,
    pub a2_is_unlocked: bool,
    pub a3_is_unlocked: bool,
    pub a4_is_unlocked: bool,
    pub a5_is_unlocked: bool,
    pub a6_is_unlocked: bool,
    pub a7_is_unlocked: bool,
    pub a8_is_unlocked: bool,
    pub a9_is_unlocked: bool,
    pub a10_is_unlocked: bool,
    pub a11_is_unlocked: bool,
    pub a12_is_unlocked: bool,
}

#[error_code]
pub enum ErrorCode {
    #[msg("you have not played enough games")]
    InvalidNumberGame,
    #[msg("you have not score enough points")]
    InvalidHighscore,
    #[msg("you have not unlock the others achievements")]
    InvalidUnlocked,
}