'use strict';

import { listen } from "./data/utility.js";

listen(window, 'load', () => {
    const pararms = new URLSearchParams(window.location.search);
    const userId = pararms.get('userId');
});
