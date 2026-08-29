import 'mocha';
import { expect } from 'chai';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

/**
 * The module scaffold is where the fleet's divergence came from: it generated new
 * modules with `types` pointing into `dist/cjs`, a flat exports map, `engines.node
 * >=12`, webpack 4, husky 4, standard-version and a Jenkinsfile — so every module
 * created from it started life off the shared contract and drifted further from there.
 *
 * These assertions are the guard. They are deliberately about the packaging contract
 * rather than exact dependency versions: versions move with dependabot, but a `types`
 * field pointing at the wrong directory is a defect in every package generated from
 * here.
 */
describe('module scaffold', () => {
    const root = join(__dirname, '../../src/templates/module');
    const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));

    describe('entry points', () => {
        it('should resolve types to the declaration build', () => {
            expect(pkg.types).to.equal('./dist/types/index.d.ts');
        });

        it('should point module and es2015 at dist/esm', () => {
            expect(pkg.module).to.equal('./dist/esm/index.js');
            expect(pkg.es2015).to.equal('./dist/esm/index.js');
        });

        it('should not reference the dropped esm5 target anywhere', () => {
            expect(JSON.stringify(pkg)).to.not.contain('esm5');
        });

        it('should declare sideEffects', () => {
            expect(pkg.sideEffects).to.equal(false);
        });
    });

    describe('exports map', () => {
        it('should use subpath keys rather than bare conditions', () => {
            expect(pkg.exports).to.have.property('.');
            expect(pkg.exports).to.have.property('./package.json');
        });

        it('should list types first in every condition', () => {
            // Resolvers take the first matching condition, so a `types` entry after
            // `require` is never reached.
            expect(Object.keys(pkg.exports['.'])[0]).to.equal('types');
        });
    });

    describe('dependency policy', () => {
        it('should bound every @openhps peer range', () => {
            Object.entries(pkg.peerDependencies as Record<string, string>)
                .filter(([name]) => name.startsWith('@openhps/'))
                .forEach(([name, range]) => {
                    expect(range, `${name} has no upper bound`).to.contain('<');
                });
        });

        it('should devDepend on every declared peer', () => {
            Object.keys(pkg.peerDependencies).forEach((name) => {
                expect(pkg.devDependencies, `${name} is a peer with no devDependency`).to.have.property(name);
            });
        });

        it('should declare tslib, which importHelpers requires at runtime', () => {
            expect(pkg.dependencies).to.have.property('tslib');
        });

        it('should not carry the retired toolchain', () => {
            const all = { ...pkg.dependencies, ...pkg.devDependencies };
            ['nyc', 'standard-version', 'jenkins-mocha', '@purtuga/esm-webpack-plugin'].forEach((name) => {
                expect(all, `${name} is retired`).to.not.have.property(name);
            });
        });
    });

    describe('generated project layout', () => {
        it('should require a supported Node', () => {
            expect(pkg.engines.node).to.equal('>=22.0.0');
        });

        it('should install husky from prepare', () => {
            expect(pkg.scripts.prepare).to.contain('husky');
        });

        it('should lint the whole project and check its peers', () => {
            // `eslint src/**` relied on shell globbing and only ever reached one depth.
            expect(pkg.scripts.lint).to.contain('eslint .');
            expect(pkg.scripts.lint).to.contain('check-peers');
        });

        it('should finalize the ESM output', () => {
            expect(pkg.scripts['build:ts:esm']).to.contain('finalize-esm');
        });

        [
            'eslint.config.js',
            '.c8rc.json',
            '.husky/pre-commit',
            'scripts/finalize-esm.mjs',
            'scripts/check-peers.mjs',
            '.github/workflows/ci.yml',
            '.github/dependabot.yml',
        ].forEach((file) => {
            it(`should ship ${file}`, () => {
                expect(existsSync(join(root, file)), `${file} is missing`).to.equal(true);
            });
        });

        it('should not ship the retired eslintrc or Jenkins config', () => {
            ['.eslintrc.js', 'Jenkinsfile', '.nycrc.json', 'tsconfig/tsconfig.bundle.esm5.json'].forEach((file) => {
                expect(existsSync(join(root, file)), `${file} should be gone`).to.equal(false);
            });
        });
    });
});
