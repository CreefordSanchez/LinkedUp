'use strict';

import { toBase64, listen, select, style, selectAll, giveClass, newElementClass, toImage, getCookieUser } from './data/utility.js';
import { getUserByEmail, getUserById } from './service/userService.js';
import { newPost, getAllPost, getPostById } from './service/postService.js';
import { addUserLikePost, getPostLikes } from './service/postLikeService.js'
import { addPostComment, getAllPostComment } from './service/postCommentService.js';
