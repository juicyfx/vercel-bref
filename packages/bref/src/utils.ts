import { BuildOptions, download, glob } from "@now/build-utils/dist";

export async function getIncludedFiles({ files, entrypoint, workPath, config, meta }: BuildOptions): Promise<Files> {
    // Download all files to workPath
    const downloadedFiles = await download(files, workPath, meta);

    let includedFiles = {};
    if (config && config.includeFiles) {
        // Find files for each glob
        for (const pattern of config.includeFiles) {
            const matchedFiles = await glob(pattern, workPath);
            Object.assign(includedFiles, matchedFiles);
        }
        // explicit and always include the entrypoint
        Object.assign(includedFiles, {
            [entrypoint]: files[entrypoint],
        });
    } else {
        // Backwards compatibility
        includedFiles = downloadedFiles;
    }

    return includedFiles;
}
