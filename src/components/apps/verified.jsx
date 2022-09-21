import React, { useCallback, useEffect, useState, useMemo } from 'react';
import {ChakraProvider, theme, Box, HStack, Flex, Button, Text, VStack, Center,
    FormLabel,  FormControl, Input, Select
 } from '@chakra-ui/react';
import { PublicKey, Transaction, TransactionInstruction } from '@solana/web3.js';
import { serialize } from 'borsh';
import { isMobile } from "react-device-detect";
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import {Card} from 'react-bootstrap';

import * as web3 from '@solana/web3.js';

import {
    ConnectionProvider,
    WalletProvider,
    useConnection,
    useWallet,
} from '@solana/wallet-adapter-react';
import {
    getPhantomWallet,
    getSolflareWallet,
    getSolletWallet,
    getSolletExtensionWallet,
} from '@solana/wallet-adapter-wallets';
import {
    WalletModalProvider,
    WalletMultiButton,
    WalletDisconnectButton,
} from '@solana/wallet-adapter-react-ui';
require('@solana/wallet-adapter-react-ui/styles.css');

const PROGRAM_KEY = new PublicKey('2GYWCuoYhJnkk9vvmfXqaiHN6W9h6wVT2XkXRQU6N4yq');   
const SYSTEM_PROGRAM_ID = new PublicKey('11111111111111111111111111111111'); 


const VerifyInstruction = {
    submit_program : 0,
    verify_program : 1
}


class Assignable {
    constructor(properties) {
      Object.keys(properties).map((key) => {
        return (this[key] = properties[key]);
      });
    }
  }
  
class SubmitMeta extends Assignable { }

const submit_schema = new Map([
    [SubmitMeta, { kind: 'struct', 
    fields: [
        ['instruction', 'u8'],
        ['address', [32]],
        ['git_repo', 'string'],
        ['git_commit', 'string'],
        ['directory', 'string'],
        ['docker_version', 'string']
    ] 
    }]
]);


function WalletNotConnected() 
{
    return (
        <Box mb  = "10px"  mt = "1rem">
            
            <Center>
                    <WalletMultiButton />
            </Center>

        </Box>
    );
}

function WalletConnected() 
{

    return (
        <Box mb  = "10px"  mt = "1rem">
             
            <Center>
                    <WalletDisconnectButton />
               
            </Center>
        </Box>
    );
}



let intervalId;
function useSolanaAccount() 
{
    const [account, setAccount] = useState(null);

    const { connection } = useConnection();
    const wallet = useWallet();
  
    const init = useCallback(async () => 
    {       
        if (wallet.publicKey) {

            let acc = await connection.getAccountInfo(wallet.publicKey);
            setAccount(acc); 
        }
    }, [wallet, connection]);

    useEffect(() => 
    {
        if (wallet.publicKey && !intervalId) {
            intervalId = setInterval(init, 1000);
        }
        else{
            clearInterval(intervalId);
            intervalId = null;
        }
    }, [init, wallet]);

    return { account };
}


export function AirDropApp() 
{
  const wallet = useWallet();
    return (
  
        <Box textAlign="center" fontSize="l">
          {wallet.publicKey &&  
          
              <WalletConnected/>
          
          }


            {!wallet.publicKey && <WalletNotConnected />}

        </Box>

      
    );
}


export function AccountInfo() 
{

  const { account } = useSolanaAccount();  
    return (
      <>
      <VStack>
      <AirDropApp/>
        <Box textAlign="center" fontSize="l">
        <Text fontSize="17" mt="1rem" mb = "1rem">
              {"Your Account Details"}
          </Text>
          <HStack>
          
                  <Box fontSize="17" textAlign = "left" >
                      
                      <VStack alignItems="start">

                          <Text >
                              {"SOL Balance"}
                          </Text>

                          <Box></Box>
                          <Box></Box>

                      </VStack>
                  </Box>
                  <Box fontSize="17">
                      <VStack>
                          
                          <FormControl id="balance" maxWidth={"175px"}>
                              <Input
                                  type="text"
                                  value={
                                      account
                                      ? account.lamports / web3.LAMPORTS_PER_SOL
                                      : "Loading.."
                                  }
                                  readOnly
                          />
                          </FormControl>

                      </VStack>
                  </Box>
              </HStack>
        </Box>
        </VStack>
        </>
    );
}


function DockerInfoBlock({which_docker})
{
    return(
        <Flex>
            {which_docker === "solana_1.14.2" && 
                <Card className="text-left" style={{flexDirection: "row"}} >
                    <Card.Body>
                        <Card.Text
                        className="text-body mb-4"
                        style={{ fontSize: "1rem" }}
                        >
                        <br/>
                        <SyntaxHighlighter language="text" style={docco}>
            {
`FROM solanalabs/solana:v1.14.2

RUN apt-get update && apt-get install -y curl git build-essential
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
ENV PATH="\${PATH}:/root/.cargo/bin"

RUN solana config set --url https://api.devnet.solana.com`
}
                        </SyntaxHighlighter>
                        Find out more <a href="https://hub.docker.com/repository/docker/daoplays/solana_v1.14.2">here</a>.

                        </Card.Text>
                    </Card.Body>
                </Card>
            }
            
        </Flex>
    );
}
  

function MainFunction()
{
   
    const [program_address, setAddress] = React.useState(null)
    const [git_repo, setGitRepo] = React.useState(null)
    const [git_commit, setGitCommit] = React.useState(null)
    const [directory, setDirectory] = React.useState(null)
    const [which_docker, setWhichDocker] = React.useState(null)



    const wallet = useWallet();
    const { connection }  = useConnection();

    const handleAddressChange = (e) => setAddress(e.target.value);
    const handleGitRepoChange = (e) => setGitRepo(e.target.value);
    const handleGitCommitChange = (e) => setGitCommit(e.target.value);
    const handleDirectoryChange = (e) => setDirectory(e.target.value);     
    const handleWhichDocker = (e) => setWhichDocker(e.target.value);
      


    const register_user = useCallback( async () => 
    {
        
        //let program_address = "7EGMFCt38NyXZHsR7G3JeBgMkNPhGF3z8g1pVLEXPA8Y";
        //let git_repo = "https://github.com/daoplays/solana_examples.git";
        //let git_commit = "f3dd81928e49299f04070dfc58dd5cd3dd48a682";
        //let directory = "charity_auction/program";
        //let which_docker = "solana_v1.14.2";
        
        let program_key = new web3.PublicKey(program_address);
        let program_meta_account = (await PublicKey.findProgramAddress([program_key.toBytes()], PROGRAM_KEY))[0];

        
        const instruction_data = new SubmitMeta(
            { 
                instruction: VerifyInstruction.submit_program,
                address: program_key.toBytes(),
                git_repo: git_repo,
                git_commit: git_commit,
                directory: directory,
                docker_version: which_docker
            }
        );

        const data = serialize(submit_schema, instruction_data);

        const submit_instruction = new TransactionInstruction({
            keys: [
                {pubkey: wallet.publicKey, isSigner: true, isWritable: true},
                {pubkey: program_meta_account, isSigner: false, isWritable: true},
                
                {pubkey: SYSTEM_PROGRAM_ID, isSigner: false, isWritable: false}

            ],
            programId: PROGRAM_KEY,
            data: data
        });

        let transaction = new Transaction();
      
        transaction.add(submit_instruction);

            try {
                await wallet.sendTransaction(
                transaction,
                connection
                );

        } catch(error) {
            console.log(error);
        }


    },
    [connection, wallet, program_address, git_repo, git_commit, directory, which_docker]
    );

    return(

        <Center>
        <Flex w="100%" mt="2rem" flexDirection="row">

        <Box w="60%" ml="1rem" borderWidth='2px' borderRadius="2rem" p='1rem'>
            {wallet.publicKey &&   
            <>
                <>
                <Text  fontSize="2rem"  textAlign="center">Register</Text>

                <Text  fontSize="1rem"  textAlign="left"><br/>To verify, enter the required data below and click Verify.  It may take up to 5 minutes for verification to complete.  </Text>
                </>
                

                
               

                   
                    <VStack align="left" spacing="1rem">
                    <HStack>
                        <FormControl  mb = "1rem" mt = "1rem" id="program_address" maxWidth={"250px"}>
                            <FormLabel>Program Address</FormLabel>
                            <Input
                                type="text"
                                value={program_address}
                                onChange={handleAddressChange}
                                
                            />
                    
                        </FormControl>

                        
                        </HStack>

                        <VStack>
                        <Select placeholder='Select Docker' onChange={handleWhichDocker}>
                            <option value='solana_1.14.2'>solana v1.14.2</option>
                        </Select>
                        <DockerInfoBlock which_docker = {which_docker}/>
                        </VStack>

                        <HStack>
                        <FormControl  mb = "1rem" mt = "1rem" id="git_repo" maxWidth={"250px"}>
                            <FormLabel>Git Repo</FormLabel>
                            <Input
                                type="text"
                                value={git_repo}
                                onChange={handleGitRepoChange}
                                
                            />
                    
                        </FormControl>
                        <FormControl  mb = "1rem" mt = "1rem" id="git_commit" maxWidth={"250px"}>
                            <FormLabel>Git Commit</FormLabel>
                            <Input
                                type="text"
                                value={git_commit}
                                onChange={handleGitCommitChange}
                                
                            />
                    
                        </FormControl>
                        <FormControl  mb = "1rem" mt = "1rem" id="directory" maxWidth={"250px"}>
                            <FormLabel>Directory</FormLabel>
                            <Input
                                type="text"
                                value={directory}
                                onChange={handleDirectoryChange}
                                
                            />
                    
                        </FormControl>
                        </HStack>
                    
                    {(directory == null || git_commit == null || git_repo == null || which_docker == null || program_address == null) ?
                    <Button  onClick={register_user} mb = "2rem"  mr = "1rem" width='150px' colorScheme='green' variant='solid'>
                        Verify
                    </Button>

                    :
                    <Button onClick={register_user} mb = "2rem"  mr = "1rem" width='150px' colorScheme='green' variant='solid'>
                        Verify
                    </Button>

                    }

                    </VStack>
                
            </>
            
            }
            {!wallet.publicKey &&   <Text  fontSize="2rem"  textAlign="center"><br/><br/>Connect A Solana Wallet To Verify</Text>}
        </Box>  
        
    
        <Box w="30%" ml="1rem" borderWidth='2px' borderRadius="2rem" p='1rem'>
            <AccountInfo/>
        </Box>
        
        
        </Flex>
        </Center>
    );
}

function Verified()
{
    const network = 'devnet';
    const endpoint = web3.clusterApiUrl(network);
    const wallets = useMemo(() => 
    [
        getPhantomWallet(),
        getSolflareWallet(),
        getSolletWallet({ network }),
        getSolletExtensionWallet({ network }),
    ],
    [network]
    );


    return(
        <ChakraProvider theme={theme}>
            <ConnectionProvider endpoint={endpoint}>
                <WalletProvider wallets={wallets} autoConnect>
                    <WalletModalProvider>

                    {!isMobile &&
                    <MainFunction/>
                    }
                    {isMobile &&
                    <Text  fontSize="1rem"  textAlign="left"><br/>Rewards Program currently doesn't support mobile use </Text>
                    }
       
        </WalletModalProvider>
        </WalletProvider>
        </ConnectionProvider>
        </ChakraProvider>

    );
}

export default Verified;