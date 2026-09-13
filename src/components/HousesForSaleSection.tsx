import React, { useState } from 'react';
import {
  Home,
  MapPin,
  Maximize,
  BedDouble,
  Bath,
  CheckCircle2,
  PhoneCall,
  Sparkles,
  ArrowUpRight,
  Eye,
  SlidersHorizontal,
} from 'lucide-react';
import { Property } from '../types';
import { useThemeLanguage } from '../context/ThemeLanguageContext';

interface HousesForSaleSectionProps {
  properties: Property[];
  onSelectProperty: (property: Property) => void;
  onBookViewing: (property: Property) => void;
}

export function HousesForSaleSection({
  properties,
  onSelectProperty,
  onBookViewing,
}: HousesForSaleSectionProps) {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [filterReadyOnly, setFilterReadyOnly] = useState<boolean>(false);
  const { theme, siteSettings, language } = useThemeLanguage();

  const isLight = theme === 'light';

  // Filter properties
  const filteredProperties = properties.filter((prop) => {
    const matchesType =
      selectedType === 'all' ||
      prop.property_type.toLowerCase() === selectedType.toLowerCase();
    const matchesReady = filterReadyOnly ? prop.ready_to_move : true;
    return matchesType && matchesReady;
  });

  const propertyTypes = [
    { id: 'all', label: language === 'ar' ? 'جميع العقارات' : language === 'en' ? 'All Residences' : 'Toutes les Résidences' },
    { id: 'villa', label: language === 'ar' ? 'فيلات فاخرة' : language === 'en' ? 'Villas' : 'Villas Contemporaines' },
    { id: 'penthouse', label: language === 'ar' ? 'بنتهاوس' : language === 'en' ? 'Penthouses' : 'Penthouses' },
    { id: 'duplex', label: language === 'ar' ? 'دوبلكس' : language === 'en' ? 'Duplex' : 'Duplex d’Architecte' },
  ];

  return (
    <section
      id="houses"
      aria-label="Maisons et Propriétés Clé en Main Prêtes à la Vente"
      className={`py-24 sm:py-32 relative transition-colors duration-500 overflow-hidden ${
        isLight ? 'bg-[#f4f1ea] text-[#161618]' : 'bg-[#0e0e10] text-[#f7f6f2]'
      }`}
    >
      {/* Ambient background decoration */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#c5a880]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#c5a880]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#c5a880]/10 border border-[#c5a880]/30 text-[#c5a880] text-xs font-mono tracking-widest uppercase mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              {language === 'ar'
                ? 'عقارات حصرية جاهزة للسكن والتسليم'
                : language === 'en'
                ? 'Turnkey Architectural Properties for Sale'
                : 'Résidences & Maisons Prêtes à Habiter'}
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-light tracking-tight mb-6">
            {language === 'ar'
              ? 'منازل وفيلات فاخرة جاهزة للتسليم الفوري'
              : language === 'en'
              ? 'Ready-to-Move Designer Homes & Villas'
              : 'Maisons & Demeures d’Exception Prêtes à la Vente'}
          </h2>

          <p className="text-base sm:text-lg text-[#8c827a] font-light leading-relaxed">
            {language === 'ar'
              ? 'فيلات وشقق فاخرة تم تصميمها وتجهيزها بالكامل بأعلى معايير الإتقان والمواد النبيلة من قبل استوديو بـسام ديكور، جاهزة للسكن الفوري بدون أي أتعاب إضافية.'
              : language === 'en'
              ? 'Architect-designed, fully renovated and turnkey furnished residences created by BESSAM.DECO. Uncompromising craftsmanship, Italian stone finishes, and modern luxury ready for immediate occupancy.'
              : 'Demeures privées, villas et penthouses entièrement conçus, aménagés et signés par l’atelier BESSAM.DECO. Matériaux nobles d’importation, mobilier sur-mesure et équipements haut de gamme prêts pour emménagement immédiat.'}
          </p>
        </div>

        {/* Filter Pills & Ready to move toggle */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-12 pb-6 border-b border-[#c5a880]/20">
          {/* Typology filter */}
          <div className="flex flex-wrap items-center gap-2">
            {propertyTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`px-4 py-2 text-xs sm:text-sm font-medium tracking-wide transition-all cursor-pointer ${
                  selectedType === type.id
                    ? 'bg-[#c5a880] text-[#0b0b0c] shadow-lg font-semibold'
                    : isLight
                    ? 'bg-[#ffffff] text-[#4a453f] hover:bg-[#e8e4dc] border border-[#d8d2c7]'
                    : 'bg-[#141416] text-[#a39e93] hover:text-[#f7f6f2] hover:bg-[#1a1a1e] border border-[#26262b]'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>

          {/* Ready-to-move checkbox toggle */}
          <button
            onClick={() => setFilterReadyOnly(!filterReadyOnly)}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-mono tracking-wider transition-all cursor-pointer border ${
              filterReadyOnly
                ? 'bg-[#c5a880]/15 border-[#c5a880] text-[#c5a880] font-semibold'
                : isLight
                ? 'bg-[#ffffff] border-[#d8d2c7] text-[#6b645b]'
                : 'bg-[#141416] border-[#26262b] text-[#a39e93]'
            }`}
          >
            <CheckCircle2
              className={`w-4 h-4 ${filterReadyOnly ? 'text-[#c5a880]' : 'opacity-40'}`}
            />
            <span>
              {language === 'ar'
                ? 'جاهزة للسكن فوراً فقط'
                : language === 'en'
                ? 'Turnkey Ready Only'
                : 'Prêt à Habiter Clé en Main'}
            </span>
          </button>
        </div>

        {/* Properties Grid */}
        {filteredProperties.length === 0 ? (
          <div
            className={`py-16 text-center border ${
              isLight
                ? 'bg-white border-[#e6e0d6]'
                : 'bg-[#141416] border-[#26262b]'
            }`}
          >
            <Home className="w-12 h-12 mx-auto text-[#c5a880]/50 mb-3" />
            <p className="text-base text-[#8c827a]">
              {language === 'ar'
                ? 'لا توجد عقارات مطابقة حالياً. تواصل معنا للحصول على عروض حصرية غير معلنة.'
                : 'Aucune propriété ne correspond à ce filtre actuellement. Contactez l’atelier pour nos résidences off-market privées.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.map((prop) => {
              const isVertical = prop.aspect_ratio === '9:16';
              return (
                <div
                  key={prop.id}
                  className={`group relative flex flex-col border transition-all duration-300 hover:shadow-2xl ${
                    isLight
                      ? 'bg-[#ffffff] border-[#e6e0d6] hover:border-[#c5a880]'
                      : 'bg-[#141416] border-[#26262b] hover:border-[#c5a880]'
                  }`}
                >
                  {/* Property Image Container */}
                  <div
                    onClick={() => onSelectProperty(prop)}
                    className={`relative overflow-hidden cursor-pointer ${
                      isVertical ? 'aspect-[4/5] sm:aspect-[3/4]' : 'aspect-[16/10]'
                    } bg-[#0c0c0e]`}
                  >
                    <img
                      src={prop.cover_image_url}
                      alt={prop.title}
                      className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                    {/* Status & Type Badges */}
                    <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-10">
                      <span className="px-2.5 py-1 bg-[#c5a880] text-[#0b0b0c] text-[10px] font-mono tracking-widest font-semibold uppercase shadow-md">
                        {prop.property_type}
                      </span>
                      {prop.ready_to_move && (
                        <span className="px-2.5 py-1 bg-emerald-700/90 text-white text-[10px] font-mono tracking-widest uppercase shadow-md flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Clé en Main</span>
                        </span>
                      )}
                    </div>

                    {/* Status badge */}
                    <div className="absolute top-4 right-4 z-10">
                      <span
                        className={`px-2.5 py-1 text-[10px] font-mono tracking-wider uppercase font-semibold shadow-md ${
                          prop.status === 'Available'
                            ? 'bg-black/75 text-emerald-400 border border-emerald-500/30'
                            : prop.status === 'Under Contract'
                            ? 'bg-black/75 text-amber-400 border border-amber-500/30'
                            : prop.status === 'Coming Soon'
                            ? 'bg-black/75 text-blue-400 border border-blue-500/30'
                            : 'bg-black/75 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {prop.status === 'Available'
                          ? 'Disponible'
                          : prop.status === 'Under Contract'
                          ? 'Sous Compromis'
                          : prop.status === 'Coming Soon'
                          ? 'Bientôt'
                          : 'Vendu'}
                      </span>
                    </div>

                    {/* Price banner on photo bottom */}
                    <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between z-10">
                      <span className="text-xl sm:text-2xl font-serif text-[#f7f6f2] font-semibold tracking-wide drop-shadow-md">
                        {prop.price_formatted}
                      </span>
                      <div className="w-8 h-8 rounded-full bg-[#c5a880] text-[#0b0b0c] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg">
                        <Eye className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  {/* Property Details Body */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Location */}
                      <div className="flex items-center gap-1.5 text-xs text-[#8c827a] mb-2 font-mono">
                        <MapPin className="w-3.5 h-3.5 text-[#c5a880] shrink-0" />
                        <span className="truncate">{prop.location}</span>
                      </div>

                      {/* Title */}
                      <h3
                        onClick={() => onSelectProperty(prop)}
                        className="text-lg sm:text-xl font-serif font-medium mb-3 line-clamp-2 cursor-pointer hover:text-[#c5a880] transition-colors"
                      >
                        {prop.title}
                      </h3>

                      {/* Key Architectural Specs Bar */}
                      <div
                        className={`grid grid-cols-4 gap-2 py-3 px-3 my-4 border text-center text-xs ${
                          isLight
                            ? 'bg-[#fcfbf9] border-[#e6e0d6]'
                            : 'bg-[#101012] border-[#202024]'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-center gap-1 text-[#8c827a] mb-1">
                            <Maximize className="w-3 h-3 text-[#c5a880]" />
                          </div>
                          <span className="font-semibold text-[13px]">{prop.area_sqm}</span>
                          <span className="text-[10px] text-[#8c827a] block">m²</span>
                        </div>

                        <div>
                          <div className="flex items-center justify-center gap-1 text-[#8c827a] mb-1">
                            <BedDouble className="w-3 h-3 text-[#c5a880]" />
                          </div>
                          <span className="font-semibold text-[13px]">{prop.bedrooms}</span>
                          <span className="text-[10px] text-[#8c827a] block">Chambres</span>
                        </div>

                        <div>
                          <div className="flex items-center justify-center gap-1 text-[#8c827a] mb-1">
                            <Bath className="w-3 h-3 text-[#c5a880]" />
                          </div>
                          <span className="font-semibold text-[13px]">{prop.bathrooms}</span>
                          <span className="text-[10px] text-[#8c827a] block">Bains</span>
                        </div>

                        <div>
                          <div className="flex items-center justify-center gap-1 text-[#8c827a] mb-1">
                            <Home className="w-3 h-3 text-[#c5a880]" />
                          </div>
                          <span className="font-semibold text-[13px]">{prop.floors || 1}</span>
                          <span className="text-[10px] text-[#8c827a] block">Niveaux</span>
                        </div>
                      </div>

                      {/* Features Badges */}
                      {prop.features && prop.features.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-5">
                          {prop.features.slice(0, 3).map((feat, idx) => (
                            <span
                              key={idx}
                              className={`text-[11px] px-2 py-0.5 border font-mono ${
                                isLight
                                  ? 'bg-[#f7f5f0] border-[#e0dad0] text-[#5a554e]'
                                  : 'bg-[#18181c] border-[#28282e] text-[#a39e93]'
                              }`}
                            >
                              • {feat}
                            </span>
                          ))}
                          {prop.features.length > 3 && (
                            <span className="text-[10px] text-[#c5a880] self-center">
                              +{prop.features.length - 3} autres
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Actions Buttons */}
                    <div className="pt-4 border-t border-[#c5a880]/15 flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => onSelectProperty(prop)}
                        className="flex-1 py-2.5 px-4 bg-[#c5a880] hover:bg-[#d6bc96] text-[#0b0b0c] text-xs font-semibold tracking-wider uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                      >
                        <span>Détails & Galerie</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onBookViewing(prop)}
                        title="Demander une visite privée"
                        className={`p-2.5 border transition-all cursor-pointer ${
                          isLight
                            ? 'border-[#d8d2c7] hover:border-[#c5a880] hover:text-[#c5a880] bg-white'
                            : 'border-[#26262b] hover:border-[#c5a880] hover:text-[#c5a880] bg-[#141416]'
                        }`}
                      >
                        <PhoneCall className="w-4 h-4 text-[#c5a880]" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom Banner for Off-Market or Custom Commission */}
        <div
          className={`mt-16 p-8 sm:p-10 border relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-6 ${
            isLight
              ? 'bg-[#ffffff] border-[#e6e0d6] shadow-xl'
              : 'bg-[#141416] border-[#26262b] shadow-2xl'
          }`}
        >
          <div className="max-w-2xl">
            <h3 className="text-xl sm:text-2xl font-serif font-light mb-2">
              {language === 'ar'
                ? 'هل تبحث عن موقع استثنائي أو فيلا بمواصفات خاصة؟'
                : 'Vous recherchez un bien off-market confidentiel ou une conception sur-mesure ?'}
            </h3>
            <p className="text-sm text-[#8c827a] font-light">
              {language === 'ar'
                ? 'يقوم استوديو بـسام ديكور بتحديد العقارات الفريدة وإعادة هيكلتها بالكامل حسب رغبة العميل مع التزام تام بالسرية.'
                : 'Notre atelier prend en charge la recherche foncière d’exception, l’acquisition et la réhabilitation architecturale complète pour investisseurs et particuliers exigeants.'}
            </p>
          </div>

          <a
            href={`https://wa.me/${(siteSettings?.whatsapp || siteSettings?.phone || '+213550123456').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
              'Bonjour BESSAM.DECO, je souhaite avoir des informations sur les résidences prêtes à la vente et projets off-market.'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3.5 bg-[#c5a880] hover:bg-[#d6bc96] text-[#0b0b0c] text-xs font-semibold tracking-widest uppercase transition-all shrink-0 shadow-lg"
          >
            Contacter la Direction Privée
          </a>
        </div>
      </div>
    </section>
  );
}
