﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HAppening.Mobile.Services
{
    public interface IFormsLocationService
    {
        void StartLocationService();
        void StopLocationService();
    }
}
