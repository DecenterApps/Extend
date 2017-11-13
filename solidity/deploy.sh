set -e # fail if any deployment fails
events=$(ETH_GAS=1061880 dapp create ExtendEvents --from=0x6c259ea1fCa0D1883e3FFFdDeb8a0719E1D7265f)
data=$(ETH_GAS=1277429 dapp create ExtendData --from=0x6c259ea1fCa0D1883e3FFFdDeb8a0719E1D7265f)
ETH_GAS=4764138 dapp create Extend "$data" "$events" --from=0x6c259ea1fCa0D1883e3FFFdDeb8a0719E1D7265f
