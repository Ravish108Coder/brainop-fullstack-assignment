import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Avatar, Spinner } from '@material-tailwind/react';
import { MoveDown, MoveUp } from 'lucide-react'

import {
    Card,
    CardBody,
    CardFooter,
    Typography,
    Button,
} from "@material-tailwind/react";

import {
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
} from "@material-tailwind/react";
import ProfileCardMenu from './ProfileCardMenu';
import { useNavigate } from 'react-router-dom';

function PostListDialog({ open, handleClose, post }) {
    return (
        <Dialog
            open={open}
            handler={handleClose}
            animate={{
                mount: { scale: 1, y: 0 },
                unmount: { scale: 0.9, y: -100 },
            }}
        >
            {post && <DialogHeader>{post.title}</DialogHeader>}
            {post && <DialogBody>
                {post && post.body}
            </DialogBody>}
            <DialogFooter>
                <Button
                    variant="text"
                    color="red"
                    onClick={handleClose}
                    className="mr-1"
                >
                    <span>Cancel</span>
                </Button>
            </DialogFooter>
        </Dialog>
    );
}

function PostListItem({ post, handleClick }) {
    const { title, body } = post;
    return (
        <Card className='relative'>
            <CardBody className='pb-28'>
                <Typography variant="h5" color="blue-gray" className="mb-2">
                    {title}
                </Typography>
                <Typography>
                    {body}
                </Typography>
            </CardBody>
            <CardFooter className="pt-0 absolute bottom-4">
                <Button onClick={() => handleClick(post)}>
                    Open
                </Button>
            </CardFooter>
        </Card>
    );
}

const PostList = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPosts, setTotalPosts] = useState(0);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);

    useEffect(() => {
        if (posts.length > 0) return;
        const fetchPosts = async () => {
            setLoading(true);
            try {
                const url = `${import.meta.env.VITE_SERVER}/api/posts?page=${page}&pageSize=9`
                // console.log(url)
                const response = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`
                    }
                });
                const newPosts = response.data.posts;
                setPage(page => page + 1);
                setTotalPosts(response.data.totalPosts)
                setPosts(prevPosts => [...prevPosts, ...newPosts]);
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
            setLoading(false);
        };

        fetchPosts();
    }, []);

    const fetchMorePosts = async () => {
        if (loading) return;
        setLoading(true);

        setTimeout(async () => {
            try {
                const url = `${import.meta.env.VITE_SERVER}/api/posts?page=${page}&pageSize=9`;
                // console.log(url);
                const response = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`
                    }
                });
                const newPosts = response.data.posts;

                setPage(page => page + 1);
                setTotalPosts(response.data.totalPosts)
                setPosts(prevPosts => [...prevPosts, ...newPosts]);
            } catch (error) {
                console.error('Error fetching more posts:', error);
            } finally {
                setLoading(false);
            }
        }, 1000);
    };

    const handleOpenDialog = (post) => {
        setSelectedPost(post);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setSelectedPost(null);
        setOpenDialog(false);
    };

    return (
        <>
            <PostListDialog
                open={openDialog}
                handleClose={handleCloseDialog}
                post={selectedPost}
            />
            <InfiniteScroll
                dataLength={posts.length} //This is important field to render the next data
                next={fetchMorePosts}
                hasMore={posts.length === 0 || posts.length < totalPosts}
                loader={<div className={` ${posts.length >= totalPosts ? 'hidden' : ''} flex justify-center pb-12 mx-auto`}><Spinner className='h-10 w-10' /></div>}
                endMessage={
                    <p style={{ textAlign: 'center' }}>
                        <b>Yay! You have seen it all</b>
                    </p>
                }
                scrollThreshold={"10px"}
            >
                <div className='grid gap-4 grid-cols-1 sm:grid-cols-2 sm:gap-8 md:grid-cols-2 lg:grid-cols-3 md:gap-8  w-full mb-20'>
                    {posts.map(post => (
                        <PostListItem
                            key={post._id}
                            post={post}
                            handleClick={handleOpenDialog}
                        />
                    ))}
                </div>
            </InfiniteScroll>
        </>
    );
};

function Home() {
    const navigate = useNavigate()
    const handleLogout = () => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_SERVER}/api/auth/logout`, {
                    method: "GET",
                });
                const data = await response.json();
                if (data?.status) {
                    localStorage.removeItem("avatar");
                    localStorage.removeItem("username");
                    localStorage.removeItem("token");
                    localStorage.removeItem("verified");
                    navigate('/signin');
                }
            } catch (error) {
                console.log(error.message)
            }
        }
        fetchData();
    }

    const PostListDialogRef = useRef(null)
    const [isEmailSent, setIsEmailSent] = useState(false);
    const [isVerified, setIsVerified] = useState(localStorage.getItem('verified') ? localStorage.getItem('verified') : false);
    const [timer, setTimer] = useState(900); // 900 seconds = 15 minutes
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if(isVerified) return;
        const interval = setInterval(() => {
            if (timer > 0) {
                setTimer(timer - 1);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [timer]);

    const sendVerificationEmail = async () => {
        setLoading(true)
        try {
            // Send request to backend to send verification email
            await axios.get(`${import.meta.env.VITE_SERVER}/api/user/sendMail`, {
                headers: {
                    Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`
                }
            });
            setIsEmailSent(true);
        } catch (error) {
            console.error('Error sending verification email:', error.message);
        }finally{
            setLoading(false)
        }
    };

    const checkVerificationStatus = async () => {
        if(isVerified) return;
        try {
            // Send request to backend to check verification status
            const response = await axios.get(`${import.meta.env.VITE_SERVER}/api/user/chech-verification-status`, {
                headers: {
                    Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`
                }
            });
            setIsVerified(response.data.isVerified);
            console.log(response.data.isVerified)
            if(response.data.isVerified === true){
                localStorage.setItem('verified', response.data.isVerified);
            }
        } catch (error) {
            console.error('Error checking verification status:', error.message);
        }
    };

    const handleResendVerification = () => {
        // Reset timer
        setTimer(900);
        // Resend verification email
        sendVerificationEmail();
    };

    useEffect(() => {
        if (isEmailSent && timer > 0 && !isVerified && (timer%5===0)) {
            checkVerificationStatus()
        }
    }, [isEmailSent, timer, isVerified]);
    
    return (
        <div className="flex flex-col p-4 pt-8 min-h-screen w-[90%] mx-auto">
            <div className='flex justify-center'>
                {
                    loading ? <Spinner className='mb-4' /> :
                    !localStorage.getItem('verified') ? (
                        <>
                            {isEmailSent ? (
                                <div>
                                    <p>Verification email sent. Checking status...</p>
                                    <p>Time remaining: {Math.floor(timer / 60)}:{timer % 60 < 10 ? `0${timer % 60}` : timer % 60}</p></div>
                            ) : (
                                <p onClick={handleResendVerification} className='hover:text-blue-600 hover:underline cursor-pointer'>Account not verified. Click here to resend verification email</p>
                            )}
                        </>
                    ) : (
                        <p>Account verified ✅</p>
                    )
                }
            </div>
            <div className='flex p-4 justify-between items-center h-[100px] border-2 bg-white rounded-xl mb-12 px-12'>
                <h1 className='font-bold text-xl text-pretty'>Welcome to Blog Post</h1>
                {/* <Avatar src={localStorage.getItem('avatar') ? String(JSON.parse(localStorage.getItem('avatar'))) : "https://docs.material-tailwind.com/img/face-2.jpg"} alt="avatar" /> */}
                <ProfileCardMenu handleLogout={handleLogout} placement={"bottom"} />
            </div>
            <div className='h-full fixed z-[99] items-center right-6 top-0 flex flex-col gap-4 justify-center'>
                <div onClick={() => {
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth', // This makes the scroll smooth
                    });
                }} className='cursor-pointer animate-bounce inline-flex justify-center items-center bg-blue-gray-100 p-4 rounded-full'><MoveUp /></div>
                <div onClick={() => {
                    window.scrollTo({
                        top: document.body.scrollHeight - 1000,
                        behavior: 'smooth', // This makes the scroll smooth
                    });
                }} className='cursor-pointer animate-bounce inline-flex justify-center items-center bg-blue-gray-100 p-4 rounded-full'><MoveDown /></div>
            </div>
            <PostList PostListDialogRef={PostListDialogRef} />

        </div>
    )
}

export default Home
