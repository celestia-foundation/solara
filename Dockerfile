# Solara ISO build container.
# One image that knows how to build both the Rust+Qt installer package and the ISO itself,
# so local builds match CI byte-for-byte.

FROM archlinux:latest

ENV LANG=C.UTF-8 \
    LC_ALL=C.UTF-8 \
    SOLARA_CONTAINER=1

RUN pacman -Syu --noconfirm --needed \
        archiso \
        grub \
        squashfs-tools \
        dosfstools \
        mtools \
        libisoburn \
        erofs-utils \
        base-devel \
        git \
        rust \
        cargo \
        clang \
        cmake \
        pkgconf \
        ninja \
        qt6-base \
        qt6-declarative \
        qt6-tools \
        qt6-svg \
        which \
    && pacman -Scc --noconfirm \
    && rm -rf /var/cache/pacman/pkg/* /var/lib/pacman/sync/*

WORKDIR /solara

CMD ["/solara/scripts/build-iso.sh"]
