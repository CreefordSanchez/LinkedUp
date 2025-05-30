'use strict';

import {listen, select} from '../data/utility.js'
import {getAllUserRequested, getAllUserRequest} from '../service/friendService.js'

const friendList = select('.new-chat-list');
const 