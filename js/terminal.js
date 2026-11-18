/**
 * SPIDER-MAN NEOBRUTALISM PORTFOLIO — SPIDER SYSTEM DEV TERMINAL
 * Evreki Wan Refanja
 */

'use strict';

window.SpiderTerminal = (function () {
    const output  = document.getElementById('terminal-output');
    const input   = document.getElementById('terminal-input');
    const sendBtn = document.getElementById('terminal-send');

    function init() {
        if (!output || !input) return;

        input.addEventListener('keydown', e => {
            if (e.key === 'Enter') {
                executeCommand(input.value);
                input.value = '';
            }
        });

        if (sendBtn) {
            sendBtn.addEventListener('click', () => {
                executeCommand(input.value);
                input.value = '';
            });
        }

        // Quick run chips
        document.querySelectorAll('.t-chip').forEach(chip => {
            const cmd = chip.dataset.cmd;
            if (cmd) {
                chip.addEventListener('click', () => {
                    executeCommand(cmd);
                    if (window.SpiderAudio) window.SpiderAudio.pop();
                });
            }
        });
    }

    function addLine(html, className = '') {
        if (!output) return;
        const line = document.createElement('div');
        line.className = 't-line ' + className;
        line.innerHTML = html;
        output.appendChild(line);
        output.scrollTop = output.scrollHeight;
    }

    const COMMANDS = {
        help: () => {
            addLine(`<span class="t-highlight">⚡ SPIDER SYSTEM AVAILABLE COMMANDS:</span>`);
            addLine(`• <span class="t-cmd">skills</span>   : View full engineering stack & percentages`);
            addLine(`• <span class="t-cmd">projects</span> : List featured mission deployments`);
            addLine(`• <span class="t-cmd">about</span>    : Developer profile & background dossier`);
            addLine(`• <span class="t-cmd">contact</span>  : Direct communication frequencies`);
            addLine(`• <span class="t-cmd">hire</span>     : Initiate collaboration protocol`);
            addLine(`• <span class="t-cmd">confetti</span> : Deploy Spider-Verse celebration`);
            addLine(`• <span class="t-cmd">clear</span>    : Wipe terminal screen buffers`);
            addLine(`• <span class="t-cmd">date</span>     : Sync local universe timestamp`);
            addLine(`• <span class="t-cmd">sudo</span>     : Check root authorization level`);
        },

        skills: () => {
            addLine(`<span style="color:#F4E409;font-weight:700">⚡ TECH ARSENAL MATRIX:</span>`);
            addLine(`[FRONTEND] HTML5, CSS3, React, Vue.js, JavaScript, Tailwind (90%)`);
            addLine(`[BACKEND]  Laravel, PHP, CodeIgniter, Golang, REST API, Python (88%)`);
            addLine(`[DATABASE] MySQL, SQL Server, PostgreSQL, Firebase (85%)`);
            addLine(`[MOBILE]   Flutter, Dart, TensorFlow Lite, Firebase (85%)`);
            addLine(`[TOOLS]    Figma, Git & GitHub, QGIS, Leaflet.js (88%)`);
        },

        projects: () => {
            addLine(`<span style="color:#38BDF8;font-weight:700">📁 ACTIVE MISSIONS / PROJECTS:</span>`);
            addLine(`1. <span class="t-highlight">KKNM System</span> — Laravel, PHP, MySQL & Admin Dashboard`);
            addLine(`2. <span class="t-highlight">AI vs Real Image Detector</span> — Flutter, Dart, TensorFlow Lite & CNN`);
            addLine(`3. <span class="t-highlight">SITEPAD</span> — Geospatial Monitoring, Laravel, QGIS & Leaflet.js`);
        },

        about: () => {
            addLine(`<span style="color:#35E86B;font-weight:700">👤 DEVELOPER IDENTITY:</span>`);
            addLine(`Name: Evreki Wan Refanja`);
            addLine(`Title: Bachelor of Informatics Engineering | Fullstack Developer`);
            addLine(`Location: Bandung, Indonesia`);
            addLine(`Specialization: Modern Web Development, REST APIs & Mobile AI Solutions`);
        },

        contact: () => {
            addLine(`<span style="color:#FF5D73;font-weight:700">📬 TRANSMIT SIGNAL / CONTACT:</span>`);
            addLine(`• Email   : evrekiwanrefanja@gmail.com`);
            addLine(`• Phone   : +62 831-4749-9369`);
            addLine(`• GitHub  : github.com/Evreki`);
            addLine(`• LinkedIn: linkedin.com/in/evreki`);
        },

        hire: () => {
            addLine(`<span style="color:#F4E409;font-weight:800;font-size:1.05rem">🚀 INITIATING COLLABORATION PROTOCOL...</span>`);
            if (typeof confetti === 'function') {
                confetti({
                    particleCount: 90,
                    spread: 75,
                    origin: { y: 0.6 },
                    colors: ['#E50914', '#2563EB', '#F4E409', '#050505', '#FFFFFF']
                });
            }
            if (window.SpiderAudio) window.SpiderAudio.coin();
            setTimeout(() => {
                const contactEl = document.getElementById('contact');
                if (contactEl) {
                    if (window.SpiderCore) window.SpiderCore.scrollTo(contactEl);
                    else contactEl.scrollIntoView({ behavior: 'smooth' });
                }
            }, 700);
        },

        confetti: () => {
            addLine('🎉 Spider-Verse Multiverse Confetti deployed!');
            if (typeof confetti === 'function') {
                confetti({
                    particleCount: 120,
                    spread: 90,
                    origin: { y: 0.5 },
                    colors: ['#E50914', '#2563EB', '#F4E409', '#050505', '#38BDF8', '#FFFFFF']
                });
            }
            if (window.SpiderAudio) window.SpiderAudio.coin();
        },

        clear: () => {
            output.innerHTML = '';
        },

        date: () => {
            addLine('🕒 Local Universe Time: ' + new Date().toLocaleString());
        },

        sudo: () => {
            addLine('<span style="color:#F4E409">👑 AUTHORIZATION GRANTED: You already have Root Level 10 Access to Evreki\'s Portfolio!</span>');
        }
    };

    function executeCommand(raw) {
        raw = (raw || '').trim();
        if (!raw) return;

        addLine(`<span class="t-prompt">guest@spider-box:~$</span> <span style="color:#fff;font-weight:700">${escapeHtml(raw)}</span>`);
        const cmdKey = raw.toLowerCase().split(' ')[0];

        if (COMMANDS[cmdKey]) {
            COMMANDS[cmdKey]();
            if (window.SpiderAudio) window.SpiderAudio.click();
        } else {
            addLine(`<span class="t-error">Command not recognized: '${escapeHtml(raw)}'. Type <span class="t-highlight">'help'</span> for instructions.</span>`);
        }
    }

    function escapeHtml(str) {
        return str.replace(/[&<>"']/g, m => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
        })[m]);
    }

    return {
        init: init,
        execute: executeCommand
    };
})();
