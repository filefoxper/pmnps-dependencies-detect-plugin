import {PackageJson, PluginResult, Project, Tools} from "pmnps-plugin";

type DeepPackageJson = PackageJson & {
    deps?: DeepPackageJson[];
    dts?: DeepPackageJson[];
};

type Route = {
    path: DeepPackageJson[];
    repeat?: boolean;
};

function routeDetect(
    pk: DeepPackageJson,
    lastPath: DeepPackageJson[]
): Route[] {
    const { deps = [] } = pk;
    const linkedPath = [...lastPath, pk];
    if (lastPath.includes(pk)) {
        return [{ path: linkedPath, repeat: true }];
    }
    const currentRoute = { path: linkedPath };
    if (!deps.length) {
        return [currentRoute];
    }
    return deps.flatMap(p => {
        return routeDetect(p, linkedPath);
    });
}

function analyze(packages: DeepPackageJson[]) {
    const packageMap = new Map<string, DeepPackageJson>(
        packages.map(d => [d.name, d])
    );
    packages.forEach(pk => {
        const { dependencies = {}, devDependencies = {} } = pk;
        const deps = { ...devDependencies, ...dependencies };
        pk.deps = Object.keys(deps)
            .map(name => packageMap.get(name))
            .filter((d): d is DeepPackageJson => !!d);
    });
    const routes = packages.flatMap(pk => routeDetect(pk, []));
    return routes.filter(({ repeat }) => repeat);
}

function refreshDependenciesDetect(
    pro: Project,
    { message }: Tools
): PluginResult {
    return {
        refresh: {
            async before(): Promise<boolean> {
                const { packages } = await pro.packageJsons();
                const repeats = analyze(packages);
                if (!repeats.length) {
                    return true;
                }
                message.warn(
                    'There are some packages with loop dependencies, you have to fix this problem, before refresh.'
                );
                repeats.forEach(({ path }) => {
                    const word = path.map(({ name }) => name).join('->');
                    message.warn(`Loop Deps: ${word}`);
                });
                return false;
            }
        }
    };
}

export default refreshDependenciesDetect;
